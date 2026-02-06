# 🚀 Smart Contract Deployment Guide

## 5-Minute Deployment to Base Sepolia

### Prerequisites
- MetaMask installed and connected to Base Sepolia testnet
- Some testnet ETH in your wallet (get from [faucet.base.org](https://faucet.base.org))
- Node.js v18+ installed

---

## Step 1: Get Your Private Key (2 minutes)

1. **Open MetaMask**
2. Click your account → **Settings**
3. Go to **Security & Privacy**
4. Click **Show Private Key**
5. Enter your password
6. **Copy your private key** (WITHOUT the 0x prefix)
⚠️ **NEVER share this or commit it to GitHub!**

---

## Step 2: Create .env File (1 minute)

1. In project root, create a file named `.env`
2. Paste this (replace with YOUR private key):
```
PRIVATE_KEY=your_private_key_here_without_0x
```

3. Save the file
4. ✅ The .gitignore already protects it from being committed

---

## Step 3: Install Hardhat (1 minute)

```bash
npm install
```

This installs:
- Hardhat (Ethereum development framework)
- Ethers.js (blockchain interaction)
- TypeChain tools

---

## Step 4: Deploy the Contract (1 minute)

```bash
npm run deploy
```

This will:
1. Compile the JumpGame.sol contract
2. Deploy to Base Sepolia testnet
3. Display your **contract address**
4. Save deployment info to `deployment.json`

**Example output:**
```
🚀 Deploying JumpGame contract to Base Sepolia...

📝 Deploying from: 0x1234...5678
💰 Account balance: 1.234 Base ETH

✅ JumpGame deployed successfully!
📍 Contract Address: 0xabcd...ef01

📄 Deployment info saved to: deployment.json

🔍 View on BaseScan: https://sepolia.basescan.org/address/0xabcd...ef01
```

---

## Step 5: Update Frontend (1 minute)

1. **Copy the contract address** from step 4
2. Open [frontend/wallet.js](frontend/wallet.js)
3. Find line 10:
   ```javascript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```
4. Replace with your address:
   ```javascript
   const CONTRACT_ADDRESS = "0xabcd...ef01"; // Your deployed address
   ```

---

## Step 6: Commit and Push

```bash
# Remove .env (should already be in .gitignore)
rm .env

# Commit the contract address update
git add frontend/wallet.js deployment.json
git commit -m "Deploy JumpGame contract to Base Sepolia"
git push origin main
```

✅ **Vercel will auto-deploy** your frontend with the contract address!

---

## Troubleshooting

### "Error: not enough ether"
→ Your testnet balance is too low. Get more Base Sepolia ETH from https://faucet.base.org

### "Error: Invalid private key"
→ Make sure:
- No `0x` prefix
- Exactly 64 hex characters
- From MetaMask (not a seed phrase)

### "Contract compilation failed"
→ Solidity version mismatch. Check [hardhat.config.js](hardhat.config.js) has version `0.8.19`

### "Network error"
→ Base Sepolia RPC endpoint issue. Check your internet connection.

---

## Verification

After deployment, verify your contract on [BaseScan](https://sepolia.basescan.org):
1. Visit the explorer URL from deployment output
2. You should see the contract code
3. Check the contract functions: `startRun`, `endRun`, `recordJump`, etc.

---

## What Happened?

You've now deployed a fully functional smart contract that tracks:
- ✅ Player XP and scores
- ✅ Game runs and jumps
- ✅ Leaderboard (top 50 players)
- ✅ Anti-bot protection

The contract is live on Base Sepolia and ready to be called from your game frontend!

---

## Next Steps

1. **Test wallet connection** in your game
2. **Deploy backend API** to Render or Railway
3. **Update backend URL** in frontend
4. **Play the game** and submit scores to the blockchain!

Questions? Check [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for full deployment overview.
