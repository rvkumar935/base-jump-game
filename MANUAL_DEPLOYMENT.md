# 🚀 Manual Smart Contract Deployment Guide

## Prerequisites Check

Before deploying, ensure you have:
- [ ] Hardhat installed: `npm ls hardhat`
- [ ] Contract in `contracts/JumpGame.sol`
- [ ] Deployment script in `scripts/deploy.js`
- [ ] MetaMask with Base Sepolia configured
- [ ] Some testnet ETH in your wallet

---

## Deployment Steps

### 1. Create `.env` File

In the project root directory, create a `.env` file with your wallet's private key:

```
PRIVATE_KEY=[your_64_character_hex_private_key]
```

**How to get your private key:**
- MetaMask → Account Settings → Security & Privacy → Show Private Key
- Enter your password and copy the hex string (without 0x prefix)

⚠️ **CRITICAL**: 
- Never share this file
- Never commit it to Git (it's in `.gitignore`)
- Delete after deployment

---

### 2. Ensure Testnet ETH Balance

Check your MetaMask:
1. Switch to **Base Sepolia** network
2. Verify you have ETH in balance

**No testnet ETH?** Get some free:
- Visit https://faucet.base.org
- Paste your wallet address
- Claim testnet ETH

---

### 3. Deploy Contract

Run the deployment script:

```bash
npm run deploy
```

**Expected output:**
```
🚀 Deploying JumpGame contract to Base Sepolia...

📝 Deploying from: 0x[your_address]
💰 Account balance: X.XXX Base ETH

✅ JumpGame deployed successfully!
📍 Contract Address: 0x[CONTRACT_ADDRESS]

📄 Deployment info saved to: deployment.json
🔍 View on BaseScan: https://sepolia.basescan.org/address/0x[CONTRACT_ADDRESS]
```

---

### 4. Save Your Contract Address

The contract address will be displayed and saved to `deployment.json`.

**Copy the contract address from output** (format: `0x...`)

---

### 5. Update Frontend

Open `frontend/wallet.js` and update **line 10**:

```javascript
// Before:
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// After: (paste your contract address)
const CONTRACT_ADDRESS = "0x[your_deployed_address]";
```

---

### 6. Clean Up & Commit

```bash
# Remove .env file (IMPORTANT: don't commit private key)
rm .env

# Commit the contract address update
git add frontend/wallet.js deployment.json
git commit -m "Deploy JumpGame contract to Base Sepolia"
git push origin main
```

✅ **Vercel automatically deploys when you push!**

---

## Verification

Verify your contract is deployed:

1. Open the BaseScan URL from step 3
2. Verify the contract code is visible and matches JumpGame.sol
3. Check the contract functions are available

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "not enough ether" | Get more testnet ETH from faucet.base.org |
| "Invalid private key" | Check: no 0x prefix, exactly 64 hex characters |
| "contract compilation failed" | Verify Solidity 0.8.19 in hardhat.config.js |
| "Network error" | Check internet connection; try again |

---

## Files Overview

| File | Purpose |
|------|---------|
| `contracts/JumpGame.sol` | Your smart contract |
| `hardhat.config.js` | Network & compiler settings |
| `scripts/deploy.js` | Deployment automation |
| `deployment.json` | Created after deployment; stores contract info |
| `.env` | Create this with your private key (never commit) |

---

## Next Steps

After successful deployment:

1. ✅ Contract deployed to Base Sepolia
2. ✅ Frontend updated with address
3. ⏭️ Deploy backend to Render/Railway
4. ⏭️ Test end-to-end game flow

See [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for backend deployment.
