// Leaderboard client for frontend
class LeaderboardClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async submitScore(address, score, xp, totalRuns, totalJumps) {
    try {
      const response = await fetch(`${this.baseUrl}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          score,
          xp,
          totalRuns,
          totalJumps
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to submit score:', error);
      throw error;
    }
  }

  async getLeaderboard(limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/leaderboard?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  async getPlayerStats(address) {
    try {
      const response = await fetch(`${this.baseUrl}/api/player/${address}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch player stats:', error);
      throw error;
    }
  }

  async getGlobalStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch global stats:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LeaderboardClient;
}
