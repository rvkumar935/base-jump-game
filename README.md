# 🏃 Base Jump Game

A Web3 gaming application on Base blockchain with smart contracts, on-chain scoring, and a community leaderboard.

## 🎮 Game Overview

- **2D Jump Runner**: Control a player character and jump over obstacles
- **1-Minute Timer**: Race against the clock to rack up the highest score
- **On-Chain Tracking**: Every jump and score is recorded on Base blockchain
- **XP System**: Earn XP for achievements and compete for rewards
- **Community Leaderboard**: Track your rank among global players
- **Anti-Bot Protection**: Advanced protections prevent cheating

## 📁 Project Structure

```
base-jump-game/
├── frontend/                 # Frontend (Web3 game UI)
│   ├── index.html           # Main game page
│   ├── leaderboard.html     # Leaderboard page
│   ├── game.js              # Phaser game logic
│   ├── wallet.js            # Web3 integration (ethers.js)
│   ├── config.js            # Game configuration
│   ├── style.css            # Styling
│   ├── leaderboard.js       # Leaderboard client
│   └── assets/              # Game images
│
├── contract/                # Smart Contract (Solidity)
│   └── JumpGame.sol         # Main contract
│
├── backend/                 # Backend (Node.js + SQLite)
│   ├── server.js            # Express API server
│   ├── package.json         # Dependencies
│   ├── leaderboard.js       # Leaderboard logic
│   └── .gitignore
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (https://nodejs.org/)
- MetaMask or Coinbase Wallet browser extension
- Chrome/Brave browser
- Base Sepolia testnet ETH (faucet: https://faucet.triangleplatform.com/base/sepolia)

### 1. Frontend Setup

```bash
cd frontend
# Open index.html in a web browser or use Live Server
# VS Code: Right-click index.html → "Open with Live Server"
```

### 2. Backend Setup (Leaderboard)

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

### 3. Smart Contract Deployment

#### Deploy on Base Sepolia:

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `JumpGame.sol`
3. Copy contents from `contract/JumpGame.sol`
4. Compile with Solidity 0.8.19+
5. Deploy to Base Sepolia network
6. Copy deployed contract address

#### Configure Frontend:

In `frontend/wallet.js`, update:
```javascript
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS_HERE"; // Replace with your address
```

## 🎮 How to Play

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select MetaMask/Coinbase Wallet
   - Switch to Base Sepolia network (auto-prompted)

2. **Start Game**
   - Click "Start Game"
   - A smart contract transaction begins your recording

3. **Jump & Score**
   - Press **SPACE** to jump
   - Each jump = +10 points in score
   - Max 60 seconds per run

4. **Game Over**
   - Time runs out automatically
   - Final score submitted to blockchain + leaderboard
   - Check leaderboard for your rank

5. **View Leaderboard**
   - Click "View Leaderboard" (or navigate to `leaderboard.html`)
   - See top 50 players
   - View your personal stats

## 📊 Leaderboard API

### Endpoints

**Submit Score**
```bash
POST /api/score
Content-Type: application/json

{
  "address": "0x...",
  "score": 500,
  "xp": 50,
  "totalRuns": 1,
  "totalJumps": 50
}
```

**Get Leaderboard**
```bash
GET /api/leaderboard?limit=50&offset=0
```

**Get Player Stats**
```bash
GET /api/player/0x...
```

**Get Global Stats**
```bash
GET /api/stats
```

**Health Check**
```bash
GET /api/health
```

## 🔐 Smart Contract Functions

### Main Functions

- `startRun()` - Begins a new game run
- `recordJump(uint256 runId)` - Records a jump during gameplay
- `endRun(uint256 runId, uint256 finalScore)` - Submits final score

### Query Functions

- `getPlayerStats(address player)` - Get player's cumulative stats
- `getTopPlayers(uint256 limit)` - Get top N leaderboard entries
- `hasActiveRun(address player)` - Check if player has active run

### Anti-Bot Protection

- Max 1 active run per wallet
- 5-second cooldown between runs
- Max 20 jumps per block
- Score validation

## 💰 XP System

XP is earned and tracked for retention:

- **+1 XP per run** completed
- **+0.1 XP per jump** recorded
- **Leaderboard XP** - Bonus for top 10 weekly

## 🌐 Networks

- **Base Sepolia (Testnet)** - For development
  - Chain ID: 84532
  - RPC: https://sepolia.base.org
  - Explorer: https://sepolia.basescan.org

- **Base Mainnet (Production)** - Deploy when ready
  - Chain ID: 8453
  - RPC: https://mainnet.base.org
  - Explorer: https://basescan.org

## 🛠 Configuration

### Game Settings (frontend/config.js)

```javascript
const GAME_TIME = 60;      // Game duration in seconds
const JUMP_FEE = 0.000001; // XP value per jump (not used now)
```

### Contract Address (frontend/wallet.js)

```javascript
const CONTRACT_ADDRESS = "0x..."; // Your deployed contract
const LEADERBOARD_API = "http://localhost:3000"; // Leaderboard backend
```

## 📈 Roadmap

- ✅ Phase 1: Smart contract on Base
- ✅ Phase 2: Off-chain leaderboard
- ✅ Phase 3: XP system
- ✅ Phase 4: Anti-bot protection
- ⏳ Phase 5: Optimize for Base Mini App
- ⏳ Multiplayer features
- ⏳ NFT rewards
- ⏳ Seasonal competitions

## 🚨 Important Notes

### For Testing

- Use Base Sepolia testnet only
- Get free testnet ETH from [faucet](https://faucet.triangleplatform.com/base/sepolia)
- Each transaction costs ~0.0001 ETH
- Leaderboard requires backend running locally

### For Production

1. Deploy contract to Base mainnet
2. Host backend on production server (Vercel, Railway, Fly.io)
3. Update `CONTRACT_ADDRESS` and `LEADERBOARD_API`
4. Enable CORS for your domain
5. Add gas optimizations if needed
6. Consider using RPC providers (Infura, Alchemy, etc.)

## 🐛 Troubleshooting

### "Contract not initialized"
- Deploy contract first
- Update `CONTRACT_ADDRESS` in wallet.js
- Refresh page after update

### "Failed to connect wallet"
- Install MetaMask or Coinbase Wallet
- Check you're on Base Sepolia network
- Try refreshing the page

### "Leaderboard not loading"
- Start backend: `cd backend && npm start`
- Check LEADERBOARD_API URL in wallet.js
- Ensure backend is running on port 3000

### "Transaction failed"
- Ensure you have enough Base Sepolia ETH
- Check if contract has enough gas
- Verify contract address is correct

## 📝 License

MIT - Feel free to fork, modify, and deploy!

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 💬 Support

- Discord: [Join our community]
- Twitter: [@basedc]
- Email: support@basejump.game

---

**Made with ❤️ on Base**

Built for the Base community with Solidity, React, and Web3 magic.
