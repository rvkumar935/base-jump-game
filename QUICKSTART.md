# 🚀 Quick Start Guide

## 🎮 For Players

### 1. Connect Wallet
- Install MetaMask or Coinbase Wallet
- Get Base Sepolia ETH from faucet
- Click "Connect Wallet"

### 2. Play the Game
- Click "Start Game"
- Press SPACE to jump
- Each jump = +10 points
- Game lasts 60 seconds

### 3. Check Leaderboard
- Click "View Leaderboard"
- See your rank
- Compare XP with other players

## 🛠️ For Developers

### Setup (5 minutes)

```bash
# 1. Navigate to project
cd ~/Desktop/base-jump-game

# 2. Start leaderboard backend
cd backend
npm install
npm start
# Backend runs on http://localhost:3000

# 3. Start frontend (new terminal)
cd frontend
# Open index.html in browser or use Live Server
```

### Deploy (15 minutes)

```bash
# 1. Deploy contract on Base Sepolia
# - Go to Remix IDE
# - Copy JumpGame.sol
# - Deploy and note address

# 2. Update frontend
# Edit frontend/wallet.js
# Change CONTRACT_ADDRESS = "0x..."

# 3. Test on Sepolia
# - Connect wallet
# - Play game
# - Check leaderboard

# 4. Deploy to production
# - Set up Vercel/Railway
# - Push to GitHub
# - Deploy!
```

## 📁 Project Structure

```
base-jump-game/
├── frontend/              # Web3 game
│   ├── index.html        # Main game
│   ├── leaderboard.html  # Rankings
│   ├── game.js           # Phaser logic
│   ├── wallet.js         # Web3 (ethers.js)
│   ├── xp-system.js      # XP & achievements
│   ├── anti-bot.js       # Anti-cheat
│   └── assets/           # Images
│
├── contract/              # Smart contract
│   └── JumpGame.sol      # Solidity code
│
├── backend/               # Leaderboard API
│   ├── server.js         # Express
│   ├── package.json      # Dependencies
│   └── leaderboard.js    # Client
│
├── README.md             # Overview
└── DEPLOYMENT.md         # Deploy guide
```

## 🎯 Key Features

✅ **Play-to-Earn**
- Earn XP per jump
- Climb the leaderboard
- Unlock achievements

✅ **On-Chain**
- Smart contracts on Base
- All scores recorded
- Transparent ranking

✅ **Anti-Bot**
- Detect cheating
- Validate gameplay
- Fair competition

✅ **Mobile Ready**
- PWA support
- Mobile-optimized
- Works in wallet browsers

## 🔑 Important Addresses

### Base Sepolia (Testing)
- Contract: (Deploy & update)
- Backend: http://localhost:3000
- Frontend: http://localhost:5500 (Live Server)

### Base Mainnet (Production)
- Contract: (Deploy)
- Backend: https://your-domain.com
- Frontend: https://your-site.com

## 🆘 Troubleshooting

### "Wallet not connecting"
- Install MetaMask
- Check you're on Base Sepolia
- Refresh page

### "Game won't start"
- Connect wallet first
- Get testnet ETH
- Check console for errors

### "Leaderboard empty"
- Start backend: `npm start` in backend folder
- Check LEADERBOARD_API URL
- Verify database file exists

## 📊 Game Mechanics

| Action | Points | XP |
|--------|--------|-----|
| Jump | +10 | +0.5 |
| Run (complete) | +score | +score/10 |
| Level up | - | varies |

## 🎯 XP Levels

- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 200 XP
- Level 4: 300 XP
- Level 5: 400 XP (unlock Blue Speed skin)
- ...and more!

## 🏆 Achievements

🦘 **First Jump** - Jump once
💯 **Century Club** - 100+ score
💰 **High Roller** - 500+ score
🏆 **Elite Jumper** - 1000+ score
🎯 **Dedicated** - 10 runs
🌟 **Jump Master** - 100+ jumps
⭐ **Leaderboard Star** - Top 10 rank
📅 **Daily Grind** - Play 7 days straight

## 💰 Gas Costs (Estimated)

| Action | Cost (Sepolia) | Cost (Mainnet) |
|--------|---|---|
| Start Run | ~0.0005 ETH | ~0.001 ETH |
| Jump (x10) | ~0.0005 ETH | ~0.001 ETH |
| End Run | ~0.001 ETH | ~0.002 ETH |

## 🔗 Useful Resources

- [Base Docs](https://docs.base.org)
- [Remix IDE](https://remix.ethereum.org)
- [Ethers.js](https://docs.ethers.org)
- [Phaser](https://phaser.io)
- [MetaMask](https://metamask.io)

## 📞 Support

- 💬 Discord: Base community
- 🐦 Twitter: @base
- 📧 Email: developers@base.org

## 🎓 Next Steps

1. ✅ Play the game locally
2. ✅ Deploy contract to Sepolia
3. ✅ Start leaderboard backend
4. ✅ Test all features
5. ✅ Deploy to production
6. ✅ Launch on Base Mini Apps

---

**Be the ultimate jumper on Base! 🏃💨**
