// XP System
class XPSystem {
  constructor() {
    this.userXP = 0;
    this.userLevel = 1;
    this.achievements = [
      { id: 'first_jump', name: 'First Jump', unlocked: false, icon: '🦘' },
      { id: 'score_100', name: 'Century Club', description: '100+ score', unlocked: false, icon: '💯' },
      { id: 'score_500', name: 'High Roller', description: '500+ score', unlocked: false, icon: '💰' },
      { id: 'score_1000', name: 'Elite Jumper', description: '1000+ score', unlocked: false, icon: '🏆' },
      { id: 'ten_runs', name: 'Dedicated', description: '10 runs', unlocked: false, icon: '🎯' },
      { id: 'hundred_jumps', name: 'Jump Master', description: '100+ jumps', unlocked: false, icon: '🌟' },
      { id: 'top_10', name: 'Leaderboard Star', description: 'Top 10 rank', unlocked: false, icon: '⭐' },
      { id: 'daily_player', name: 'Daily Grind', description: 'Play 7 days', unlocked: false, icon: '📅' }
    ];
  }

  /**
   * Calculate XP from score
   */
  calculateXP(score, jumps) {
    const baseXP = Math.floor(score / 10);
    const jumpXP = Math.floor(jumps * 0.5);
    return baseXP + jumpXP;
  }

  /**
   * Add XP and check for level up
   */
  addXP(amount) {
    this.userXP += amount;
    const oldLevel = this.userLevel;
    this.userLevel = Math.floor(this.userXP / 100) + 1;

    if (this.userLevel > oldLevel) {
      return {
        levelUp: true,
        newLevel: this.userLevel,
        totalXP: this.userXP
      };
    }

    return { levelUp: false, totalXP: this.userXP };
  }

  /**
   * Check and unlock achievements
   */
  checkAchievements(playerStats) {
    const newUnlocks = [];

    if (playerStats.jumps >= 1 && !this.achievements[0].unlocked) {
      this.achievements[0].unlocked = true;
      newUnlocks.push(this.achievements[0]);
    }

    if (playerStats.score >= 100 && !this.achievements[1].unlocked) {
      this.achievements[1].unlocked = true;
      newUnlocks.push(this.achievements[1]);
    }

    if (playerStats.score >= 500 && !this.achievements[2].unlocked) {
      this.achievements[2].unlocked = true;
      newUnlocks.push(this.achievements[2]);
    }

    if (playerStats.score >= 1000 && !this.achievements[3].unlocked) {
      this.achievements[3].unlocked = true;
      newUnlocks.push(this.achievements[3]);
    }

    if (playerStats.runs >= 10 && !this.achievements[4].unlocked) {
      this.achievements[4].unlocked = true;
      newUnlocks.push(this.achievements[4]);
    }

    if (playerStats.jumps >= 100 && !this.achievements[5].unlocked) {
      this.achievements[5].unlocked = true;
      newUnlocks.push(this.achievements[5]);
    }

    return newUnlocks;
  }

  /**
   * Get player skins based on XP level
   */
  getUnlockedSkins(level) {
    const skins = [
      { level: 1, name: 'Classic', color: 'red', cost: 0 },
      { level: 5, name: 'Blue Speed', color: 'blue', cost: 500 },
      { level: 10, name: 'Golden', color: 'gold', cost: 1000 },
      { level: 15, name: 'Neon', color: '#00ff00', cost: 1500 },
      { level: 20, name: 'Rainbow', color: '#ff00ff', cost: 2000 }
    ];

    return skins.filter(skin => level >= skin.level);
  }

  /**
   * Get player badges
   */
  getPlayerBadges(stats) {
    const badges = [];

    if (stats.runs > 0) badges.push({ name: 'Player', icon: '👤' });
    if (stats.score > 500) badges.push({ name: 'High Scorer', icon: '📊' });
    if (stats.jumps > 100) badges.push({ name: 'Jumper', icon: '🦘' });
    if (this.userLevel > 5) badges.push({ name: 'Legend', icon: '⚡' });
    if (stats.rank && stats.rank <= 10) badges.push({ name: 'Champion', icon: '🏆' });

    return badges;
  }

  /**
   * Format XP display with commas
   */
  formatXP(xp) {
    return xp.toLocaleString();
  }

  /**
   * Get XP until next level
   */
  getXPToNextLevel() {
    const nextLevelXP = this.userLevel * 100;
    return nextLevelXP - this.userXP;
  }

  /**
   * Get XP progress percentage
   */
  getXPProgress() {
    const currentLevelXP = (this.userLevel - 1) * 100;
    const nextLevelXP = this.userLevel * 100;
    const progressXP = this.userXP - currentLevelXP;
    const totalXP = nextLevelXP - currentLevelXP;
    return Math.floor((progressXP / totalXP) * 100);
  }
}

// Create global XP system instance
const xpSystem = new XPSystem();

/**
 * Display XP notification
 */
function showXPNotification(amount, type = 'jump') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #00ff00;
    color: black;
    padding: 20px 30px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 24px;
    z-index: 10000;
    animation: popUp 1s ease-out;
    pointer-events: none;
  `;

  const emoji = type === 'jump' ? '⬆️' : type === 'levelup' ? '🎉' : '⭐';
  notification.innerHTML = `${emoji} +${amount} XP`;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes popUp {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -200%) scale(0.5); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 1000);
}

/**
 * Update XP display in UI
 */
function updateXPDisplay() {
  const xpElement = document.getElementById('player-xp-display');
  if (xpElement) {
    xpElement.innerText = `Level ${xpSystem.userLevel} • ${xpSystem.formatXP(xpSystem.userXP)} XP`;
  }

  const progressElement = document.getElementById('xp-progress');
  if (progressElement) {
    progressElement.style.width = xpSystem.getXPProgress() + '%';
  }

  const nextLevelElement = document.getElementById('xp-to-next');
  if (nextLevelElement) {
    nextLevelElement.innerText = `${xpSystem.getXPToNextLevel()} XP to next level`;
  }
}

/**
 * Show achievement unlock notification
 */
function showAchievementUnlock(achievement) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #2a2a2a;
    border: 2px solid #ffd700;
    color: #ffd700;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.5s ease-out;
    min-width: 250px;
  `;

  notification.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 5px;">${achievement.icon}</div>
    <div style="font-size: 14px;">🏅 Achievement Unlocked!</div>
    <div style="font-size: 16px; color: #00ff00;">${achievement.name}</div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      0% { opacity: 0; transform: translateX(400px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}
