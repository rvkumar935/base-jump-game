// Anti-Bot Protection System
class AntiBotSystem {
  constructor() {
    this.sessionId = this._generateSessionId();
    this.jumpTimestamps = [];
    this.jumpCount = 0;
    this.gameStartTime = null;
    this.isValid = true;
    this.violations = [];
    this.maxJumpsPerSecond = 5;
    this.maxJumpsPerGame = 300; // ~5 jumps per second for 60s
    this.minJumpInterval = 100; // ms between jumps
  }

  /**
   * Generate unique session ID
   */
  _generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Record jump and check for violations
   */
  recordJump(score, currentJumpCount) {
    const now = Date.now();
    this.jumpTimestamps.push(now);
    this.jumpCount++;

    // Clean up old timestamps (keep last 1 second)
    this.jumpTimestamps = this.jumpTimestamps.filter(ts => now - ts < 1000);

    // Check violations
    this._checkJumpSpeedViolation();
    this._checkScoreConsistency(score, currentJumpCount);
    this._checkTotalJumpViolation();

    return {
      isValid: this.isValid,
      violations: this.violations,
      sessionId: this.sessionId
    };
  }

  /**
   * Start game session
   */
  startSession() {
    this.gameStartTime = Date.now();
    this.jumpTimestamps = [];
    this.jumpCount = 0;
    this.violations = [];
    this.isValid = true;
  }

  /**
   * End game session and validate
   */
  endSession(finalScore) {
    const gameEnded = Date.now();
    const gameDuration = (gameEnded - this.gameStartTime) / 1000; // seconds

    const validation = {
      sessionId: this.sessionId,
      valid: this.isValid && this.violations.length === 0,
      score: finalScore,
      jumps: this.jumpCount,
      duration: Math.min(gameDuration, 60), // Max 60 seconds
      violations: this.violations,
      timestamp: new Date().toISOString()
    };

    console.log('🛡️ Session Validation:', validation);
    return validation;
  }

  /**
   * Check for impossible jump speed
   */
  _checkJumpSpeedViolation() {
    // If more than 5 jumps in last second = suspicious
    if (this.jumpTimestamps.length > this.maxJumpsPerSecond) {
      const violation = {
        type: 'JUMP_SPEED_VIOLATION',
        message: `${this.jumpTimestamps.length} jumps in 1 second (max: ${this.maxJumpsPerSecond})`,
        severity: 'HIGH'
      };
      this.violations.push(violation);
      this.isValid = false;
      console.warn('⚠️ ' + violation.message);
    }
  }

  /**
   * Check score-jump consistency
   * Score should be ~10 points per jump (some variance allowed)
   */
  _checkScoreConsistency(score, jumpCount) {
    if (jumpCount < 5) return; // Not enough data

    const expectedScore = jumpCount * 10;
    const variance = Math.abs(score - expectedScore) / expectedScore;

    // Allow 20% variance for legitimate gameplay
    if (variance > 0.5) {
      const violation = {
        type: 'SCORE_JUMP_INCONSISTENCY',
        message: `Score mismatch: ${score} points for ${jumpCount} jumps`,
        severity: 'MEDIUM'
      };
      this.violations.push(violation);
      console.warn('⚠️ ' + violation.message);
    }
  }

  /**
   * Check total jump count limits
   */
  _checkTotalJumpViolation() {
    if (this.jumpCount > this.maxJumpsPerGame) {
      const violation = {
        type: 'TOTAL_JUMP_VIOLATION',
        message: `${this.jumpCount} total jumps (max: ${this.maxJumpsPerGame})`,
        severity: 'HIGH'
      };
      this.violations.push(violation);
      this.isValid = false;
      console.warn('⚠️ ' + violation.message);
    }
  }

  /**
   * Validate game metadata
   */
  validateGameData(gameData) {
    const errors = [];

    // Check score is positive
    if (!gameData.score || gameData.score <= 0) {
      errors.push('Invalid score');
    }

    // Check jumps are positive
    if (!gameData.jumps || gameData.jumps < 0) {
      errors.push('Invalid jump count');
    }

    // Check duration
    if (!gameData.duration || gameData.duration > 60) {
      errors.push('Invalid game duration');
    }

    // Check address format
    if (!gameData.address || !gameData.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      errors.push('Invalid wallet address');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get anti-bot report
   */
  getReport() {
    return {
      sessionId: this.sessionId,
      isValid: this.isValid,
      violationCount: this.violations.length,
      violations: this.violations,
      jumpCount: this.jumpCount,
      riskLevel: this._calculateRiskLevel()
    };
  }

  /**
   * Calculate risk level based on violations
   */
  _calculateRiskLevel() {
    if (this.violations.length === 0) return 'LOW';
    
    const highSeverity = this.violations.filter(v => v.severity === 'HIGH').length;
    const mediumSeverity = this.violations.filter(v => v.severity === 'MEDIUM').length;

    if (highSeverity > 0) return 'CRITICAL';
    if (mediumSeverity >= 2) return 'HIGH';
    if (mediumSeverity > 0) return 'MEDIUM';
    
    return 'LOW';
  }
}

// Create global anti-bot instance
const antiBot = new AntiBotSystem();

/**
 * Validate jump action
 */
function validateJumpAction() {
  if (antiBot.violations.length > 0 && antiBot.isValid === false) {
    console.warn('🛑 Jump validation failed:', antiBot.violations);
    return false;
  }
  return true;
}

/**
 * Log anti-bot metrics
 */
function logAntiBotMetrics() {
  const report = antiBot.getReport();
  console.log('🛡️ Anti-Bot Report:', {
    sessionId: report.sessionId,
    isValid: report.isValid,
    violations: report.violationCount,
    riskLevel: report.riskLevel,
    details: report.violations
  });
}
