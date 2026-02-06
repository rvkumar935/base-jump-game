# 🚀 Base Mini App Deployment Guide

## What is a Base Mini App?

A Base Mini App is a lightweight, wallet-integrated Web3 game that:
- Runs directly in wallet browsers (MetaMask, Coinbase Wallet, etc.)
- Requires no installation
- Has instant access to user's wallet
- Is optimized for mobile
- Integrates seamlessly with Base blockchain

## Prerequisites

- Deployed JumpGame.sol contract on Base mainnet
- Backend server for leaderboard (Render, Railway, Vercel, etc.)
- Domain or hosting provider (Vercel, Netlify, GitHub Pages)

## Step 1: Prepare for Production

### Update Configuration

In `frontend/wallet.js`:

```javascript
// Production settings
const CONTRACT_ADDRESS = "0xYOUR_MAINNET_CONTRACT"; // Base mainnet contract
const BASE_SEPOLIA_RPC = "https://mainnet.base.org"; // Mainnet RPC
const LEADERBOARD_API = "https://api.yoursite.com"; // Production backend
```

### Test on Base Mainnet

Before launching publicly:
1. Deploy contract to Base mainnet
2. Test all functions
3. Verify gas costs are reasonable
4. Test wallet integration

## Step 2: Deploy Smart Contract

### Using Remix IDE + MetaMask

1. Go to https://remix.ethereum.org/
2. Create `JumpGame.sol`
3. Compile with Solidity 0.8.19+
4. Deploy to Base mainnet
5. Note contract address
6. Verify on [BaseScan](https://basescan.org)

### Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install -D hardhat @nomicfoundation/hardhat-toolbox

# Create project
npx hardhat init

# Deploy
npx hardhat run scripts/deploy.js --network base
```

## Step 3: Deploy Backend

### Option A: Vercel (Recommended)

```bash
cd backend
vercel
# Follow prompts
```

### Option B: Railway

```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option C: Render

1. Push backend to GitHub
2. Connect to Render
3. Create new Web Service
4. Select Node.js
5. Deploy

**Update frontend with backend URL**

In `frontend/wallet.js`:
```javascript
const LEADERBOARD_API = "https://your-backend.vercel.app"; // or railway/render URL
```

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

```bash
cd frontend
npm install -g vercel
vercel
```

### Option B: Netlify

```bash
cd frontend
npm install -g netlify-cli
netlify deploy --dir .
```

### Option C: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourname.github.io/base-jump-game"

# Deploy
git push origin main
```

## Step 5: Register as Base Mini App

### 1. Submit to Base Community

Contact:
- Email: miniapps@base.org
- Discord: Base Discord server
- Form: https://base.org/miniapps/submit

### 2. Provide Information

- **App Name**: Base Jump Game
- **URL**: https://your-site.com
- **Contract Address**: 0x...
- **Description**: Earn XP and compete on the leaderboard
- **Category**: Games
- **Logo**: SVG or PNG (512x512)
- **Screenshots**: 3-5 game screenshots

### 3. Optimize for Wallet Browsers

The app now supports:
- ✅ MetaMask Browser
- ✅ Coinbase Wallet App
- ✅ Rainbow Wallet
- ✅ Uniswap Wallet
- ✅ All WalletConnect-compatible wallets

## Step 6: Marketing & Launch

### 1. Social Media

```
🏃 Base Jump Game is LIVE! 🎮

Earn XP, compete on the leaderboard, and prove you're the ultimate jumper on Base.

🎮 Play now: [link]
🏆 Top up: [leaderboard link]
⛓️ Built on Base

#BaseJump #GameFi #Web3Gaming
```

### 2. Community Channels

- Post in Base Discord #builders
- Tweet with #Base #GameFi
- Share in Web3 communities

### 3. Monitor

- Track gameplay metrics
- Monitor gas costs
- Check leaderboard engagement
- Gather feedback

## Step 7: Monitoring & Maintenance

### Track Key Metrics

- Daily active users
- Total XP earned
- Gas spent
- Leaderboard activity

### Update & Iterate

1. Gather player feedback
2. Add new features
3. Optimize gas usage
4. Fix bugs

### Smart Contract Updates

If you need updates:
1. Deploy new contract
2. Migrate user data
3. Update frontend
4. Announce changes

## Configuration Checklist

- [ ] Contract address updated for mainnet
- [ ] Leaderboard API URL configured
- [ ] Service worker registered
- [ ] Manifest file includes app info
- [ ] Icons generated
- [ ] Meta tags set for sharing
- [ ] Mobile viewport optimized
- [ ] Anti-bot system active
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested

## Environment Variables

Create `.env` in frontend (for build-time):

```
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_LEADERBOARD_API=https://api.yoursite.com
REACT_APP_RPC_URL=https://mainnet.base.org
```

## Common Issues

### Service Worker Not Registering

- Check browser console for errors
- Verify HTTPS is enabled
- Clear browser cache

### Wallet Connection Fails

- Ensure MetaMask is installed
- Check network is Base (chainId: 0x2105)
- Verify contract address is correct

### Leaderboard Empty

- Verify backend is running
- Check CORS is enabled
- Confirm database has data

### High Gas Costs

Monitor gas usage and consider:
- Batching transactions
- Using ERC-4337 account abstraction
- Optimizing contract logic

## Security Checklist

- [ ] Contract audited
- [ ] Gas limits set
- [ ] Anti-bot protection active
- [ ] Input validation in place
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting on backend
- [ ] Database backups enabled

## Performance Optimization

### Frontend

- Minify code
- Optimize images
- Use CDN
- Enable compression
- Lazy load assets

### Smart Contract

- Use events instead of storage when possible
- Optimize storage
- Minimize external calls
- Set reasonable gas limits

### Backend

- Use database indexing
- Cache frequently accessed data
- Implement rate limiting
- Use connection pooling

## Support & Resources

- Base Docs: https://docs.base.org
- Solidity Docs: https://docs.soliditylang.org
- Ethers.js Docs: https://docs.ethers.org
- Vercel Docs: https://vercel.com/docs
- Discord: https://base.org/discord

---

**Congratulations! Your Base Mini App is live! 🎉**
