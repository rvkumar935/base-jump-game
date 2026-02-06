# 🎮 Base Jump Game - Complete Deployment Setup

Your smart contract deployment infrastructure is ready! Here's exactly what you need to do:

## 📦 What's Been Set Up

I've created everything you need to deploy the JumpGame smart contract to Base Sepolia:

```
hardhat.config.js          → Blockchain configuration
contracts/JumpGame.sol     → Your smart contract
scripts/deploy.js          → Automated deployment script
.env.example               → Template for your private key
deploy.sh                  → Interactive deployment helper
```

---

## 🚀 **DEPLOY NOW - MANUAL STEPS**

### Step 1: Create .env File (1 min)

In your project root, create a file named `.env` with your wallet private key.

**⚠️ SECURITY**: 
- Never commit `.env` to GitHub (already in `.gitignore`)
- Never share your private key
- Delete `.env` after deployment

---

### Step 2: Ensure You Have Base Sepolia Testnet ETH (1 min)

You need some testnet ETH to pay for contract deployment gas.

**Get Free Testnet ETH:**
- Go to https://faucet.base.org
- Paste your wallet address
- Verify and claim testnet ETH

**Check balance in MetaMask:**
- Switch to Base Sepolia network
- Check ETH balance in wallet

---

### Step 3: Run Deployment (1 min)

From your project root:

```bash
npm run deploy
```

Or use the interactive helper:

```bash
chmod +x deploy.sh
./deploy.sh
```

**What happens**:
1. Hardhat compiles your contract
2. Signs the deployment transaction with your private key
3. Deploys to Base Sepolia testnet
4. Outputs your contract address
5. Saves deployment info to `deployment.json`

**Example output**:
```
✅ JumpGame deployed successfully!
📍 Contract Address: 0xabc123def456...
📄 Deployment info saved to: deployment.json
🔍 View on BaseScan: https://sepolia.basescan.org/address/0xabc123def456...
```

---

### Step 4: Update Frontend (1 min)

1. **Copy** the contract address from Step 4
2. Open `frontend/wallet.js`
3. Find **line 10**:
   ```javascript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```
4. Replace with your address:
   ```javascript
   const CONTRACT_ADDRESS = "0xabc123def456..."; // Your deployed address
   ```
5. **Save the file**

---

### Step 5: Commit & Push (1 min)

```bash
# Remove .env before committing (IMPORTANT!)
rm .env

# Commit changes
git add frontend/wallet.js deployment.json
git commit -m "Deploy JumpGame contract to Base Sepolia"
git push origin main
```

✅ **Vercel will auto-deploy** your frontend with the contract address!

---

## 🔍 Verify Deployment

After deployment, verify your contract is live:

1. Open the BaseScan URL from deployment output
2. You should see:
   - Contract code (JumpGame.sol)
   - All contract functions
   - Your deployment transaction
3. You can call read-only functions directly on BaseScan

---

## 💻 File Reference

**Key files created/updated:**

| File | Purpose |
|------|---------|
| `hardhat.config.js` | Blockchain network configuration |
| `contracts/JumpGame.sol` | Your smart contract (Solidity) |
| `scripts/deploy.js` | Deployment script |
| `.env.example` | Example of required env variables |
| `.env` | Your private key (create this, don't commit) |
| `package.json` | Updated with hardhat dependencies |
| `deployment.json` | Generated after deployment with contract info |

---

## ❓ Troubleshooting

### "Error: Private key not set"
→ Create `.env` file with your`PRIVATE_KEY` variable

### "Error: not enough ether"
→ Get more Base Sepolia ETH from https://faucet.base.org

### "Error: Invalid private key"
→ Check:
- No `0x` prefix (just the hex characters)
- Exactly 64 hex characters
- Copied directly from MetaMask

### "Contract compilation failed"
→ Ensure `hardhat.config.js` has correct Solidity version (0.8.19)

### "Network timeout"
→ Check internet connection or try again in a moment

---

## 📊 What You've Deployed

Your smart contract includes:

✅ **Game Flow**
- `startRun()` - Begin a new game session
- `recordJump()` - Track jumps during gameplay
- `endRun()` - Complete run and award XP

✅ **Leaderboard**
- Top 50 players by score
- On-chain leaderboard tracking
- Automatic score ranking

✅ **Anti-Bot Protection**
- 5-second cooldown between runs
- Max 20 jumps per block
- One active run per wallet

✅ **Player Statistics**
- XP earned
- Best score achieved
- Total runs played
- Total jumps recorded

---

## 🎯 Next Steps After Deployment

1. **Test in browser**:
   - Go to http://localhost:8000 (or your Vercel URL)
   - Click "Connect Wallet"
   - Verify contract address shows correctly

2. **Deploy Backend API**:
   - Follow [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for Render/Railway setup

3. **Test Complete Flow**:
   - Play game
   - Connect wallet
   - Submit score to blockchain
   - Check leaderboard

4. **Deploy to Production**:
   - Update to Base Mainnet (when ready for real ETH)
   - Deploy frontend to Vercel
   - Deploy backend to production

---

## 🔗 Useful Links

- **Base Sepolia Faucet**: https://faucet.base.org
- **BaseScan Explorer**: https://sepolia.basescan.org
- **MetaMask**: https://metamask.io
- **Hardhat Docs**: https://hardhat.org
- **Ethers.js Docs**: https://docs.ethers.org

---

## ✅ Deployment Checklist

- [ ] Private key obtained from MetaMask
- [ ] `.env` file created with PRIVATE_KEY
- [ ] Base Sepolia testnet ETH acquired
- [ ] `npm run deploy` executed successfully
- [ ] Contract deployed to Base Sepolia
- [ ] Contract address copied
- [ ] `frontend/wallet.js` updated with address
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel frontend auto-deployed
- [ ] Verified contract on BaseScan
- [ ] Tested wallet connection in browser
- [ ] Backend deployment next (see DEPLOY_GUIDE.md)

---

**Ready? Run `npm run deploy` or `./deploy.sh` now!**
