let score = 0;
let timer = GAME_TIME;
let gameStarted = false;
let runId = null;
let timerInterval = null;

const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  parent: "game",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 600 } }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(phaserConfig);

function preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("ground", "assets/ground.png");
}

function create() {
  this.player = this.physics.add.sprite(100, 300, "player");
  this.ground = this.physics.add.staticImage(400, 380, "ground");

  this.physics.add.collider(this.player, this.ground);

  this.input.keyboard.on("keydown-SPACE", async () => {
    if (!gameStarted || !userAddress) return;
    if (this.player.body.touching.down) {
      // Anti-bot: Validate jump
      if (!validateJumpAction()) {
        console.warn('❌ Jump rejected by anti-bot system');
        return;
      }

      this.player.setVelocityY(-350);
      score += 10;
      
      // Record jump in anti-bot system
      const jumpValidation = antiBot.recordJump(score, Math.floor(score / 10));
      
      // Update score display
      const scoreEl = document.getElementById("score-display");
      if (scoreEl) scoreEl.innerText = "Score: " + score;
      
      try {
        await recordJump(runId); // 🔥 send to contract
        console.log("✅ Jump recorded, Score:", score);
      } catch (error) {
        console.error("❌ Jump failed:", error.message);
      }
    }
  });
}

function update() {
  if (!gameStarted) return;
}

document.getElementById("start").onclick = async () => {
  if (!userAddress) {
    alert("⚠️ Please connect wallet first");
    return;
  }

  gameStarted = true;
  score = 0;
  timer = GAME_TIME;

  // Clear any existing timer
  if (timerInterval) clearInterval(timerInterval);

  // Start anti-bot session
  antiBot.startSession();

  // Start new run
  try {
    runId = await startRun(userAddress);
    console.log("🎮 Game started, Run ID:", runId);
    console.log("🛡️ Anti-bot session started:", antiBot.sessionId);
    document.getElementById("timer").innerText = "⏱️ Time: " + timer + "s";
  } catch (error) {
    console.error("❌ Failed to start run:", error.message);
    alert("Failed to start game: " + error.message);
    gameStarted = false;
    return;
  }

  timerInterval = setInterval(async () => {
    timer--;
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.innerText = "⏱️ Time: " + timer + "s";
    
    if (timer <= 0) {
      gameStarted = false;
      clearInterval(timerInterval);
      
      try {
        // End anti-bot session
        const sessionValidation = antiBot.endSession(score);
        logAntiBotMetrics();

        // Check if session is valid before submitting
        if (!sessionValidation.valid) {
          console.error('⚠️ Game detected suspicious activity');
          alert("⚠️ Game validation failed. Please play fairly.");
          return;
        }

        await endRun(runId, score);
        
        // Award XP
        const xpEarned = xpSystem.calculateXP(score, Math.floor(score / 10));
        const levelUpResult = xpSystem.addXP(xpEarned);
        
        if (levelUpResult.levelUp) {
          showXPNotification(`LEVEL UP! You're now Level ${levelUpResult.newLevel}`, 'levelup');
        } else {
          showXPNotification(xpEarned, 'level');
        }
        
        updateXPDisplay();
        alert("🎉 Game Over! Final Score: " + score + "\n⭐ XP Earned: +" + xpEarned);
      } catch (error) {
        console.error("❌ Failed to end run:", error.message);
      }
    }
  }, 1000);
};
