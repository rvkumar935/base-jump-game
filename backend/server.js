const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'leaderboard.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database error:', err.message);
  } else {
    console.log('✅ Database connected');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL UNIQUE,
      best_score INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      total_runs INTEGER DEFAULT 0,
      total_jumps INTEGER DEFAULT 0,
      timestamp INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Table creation error:', err.message);
    else console.log('✅ Database tables initialized');
  });

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_address ON scores(address)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_best_score ON scores(best_score DESC)
  `);
}

// ============ API ROUTES ============

/**
 * @POST /api/score
 * Submit or update a player's score
 */
app.post('/api/score', (req, res) => {
  const { address, score, xp, totalRuns, totalJumps } = req.body;

  if (!address || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // Normalize address
  const normalizedAddress = address.toLowerCase();
  const timestamp = Math.floor(Date.now() / 1000);

  db.run(
    `INSERT INTO scores (address, best_score, xp, total_runs, total_jumps, timestamp)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(address) DO UPDATE SET
     best_score = MAX(best_score, ?),
     xp = xp + ?,
     total_runs = total_runs + ?,
     total_jumps = total_jumps + ?,
     updated_at = CURRENT_TIMESTAMP`,
    [normalizedAddress, score, xp, totalRuns, totalJumps, timestamp, score, xp, totalRuns, totalJumps],
    function (err) {
      if (err) {
        console.error('❌ Database error:', err.message);
        return res.status(500).json({ error: 'Failed to save score' });
      }

      res.json({ success: true, address: normalizedAddress, score });
    }
  );
});

/**
 * @GET /api/leaderboard
 * Get top N players
 */
app.get('/api/leaderboard', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const offset = Math.min(parseInt(req.query.offset) || 0, 10000);

  db.all(
    `SELECT address, best_score, xp, total_runs, total_jumps, updated_at
     FROM scores
     WHERE best_score > 0
     ORDER BY best_score DESC, xp DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch leaderboard' });
      }

      res.json({
        success: true,
        leaderboard: rows.map((row, index) => ({
          rank: offset + index + 1,
          address: row.address,
          score: row.best_score,
          xp: row.xp,
          totalRuns: row.total_runs,
          totalJumps: row.total_jumps,
          timestamp: row.updated_at
        }))
      });
    }
  );
});

/**
 * @GET /api/player/:address
 * Get specific player stats
 */
app.get('/api/player/:address', (req, res) => {
  const address = req.params.address.toLowerCase();

  db.get(
    `SELECT address, best_score, xp, total_runs, total_jumps, updated_at
     FROM scores
     WHERE address = ?`,
    [address],
    (err, row) => {
      if (err) {
        console.error('❌ Database error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch player stats' });
      }

      if (!row) {
        return res.json({
          success: true,
          player: {
            address,
            score: 0,
            xp: 0,
            totalRuns: 0,
            totalJumps: 0,
            rank: null
          }
        });
      }

      // Get player rank
      db.get(
        `SELECT COUNT(*) as rank FROM scores
         WHERE best_score > ? OR (best_score = ? AND updated_at > ?)`,
        [row.best_score, row.best_score, row.updated_at],
        (err, rankRow) => {
          res.json({
            success: true,
            player: {
              address: row.address,
              score: row.best_score,
              xp: row.xp,
              totalRuns: row.total_runs,
              totalJumps: row.total_jumps,
              rank: rankRow.rank + 1
            }
          });
        }
      );
    }
  );
});

/**
 * @GET /api/stats
 * Global game statistics
 */
app.get('/api/stats', (req, res) => {
  db.all(
    `SELECT 
       COUNT(*) as totalPlayers,
       SUM(best_score) as totalScore,
       SUM(xp) as totalXP,
       SUM(total_runs) as totalRuns,
       SUM(total_jumps) as totalJumps
     FROM scores
     WHERE best_score > 0`,
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      const stats = rows[0] || { totalPlayers: 0, totalScore: 0, totalXP: 0, totalRuns: 0, totalJumps: 0 };

      res.json({
        success: true,
        stats: {
          totalPlayers: stats.totalPlayers || 0,
          totalScore: stats.totalScore || 0,
          totalXP: stats.totalXP || 0,
          totalRuns: stats.totalRuns || 0,
          totalJumps: stats.totalJumps || 0
        }
      });
    }
  );
});

/**
 * @GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Leaderboard server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  db.close((err) => {
    if (err) console.error('❌ Database error:', err.message);
    process.exit(0);
  });
});
