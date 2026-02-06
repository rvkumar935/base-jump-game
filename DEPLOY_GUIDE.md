# Deployment Guide: JumpGame Smart Contract & Backend

## Phase 1: Deploy Smart Contract to Base Sepolia

### Option A: Using Remix (Easiest - No Setup Required)

1. **Open Remix IDE**
   - Go to https://remix.ethereum.org
   - Create a new file: `JumpGame.sol`

2. **Copy the smart contract code**
   - Copy all content from `/contract/JumpGame.sol`
   - Paste into Remix editor

3. **Configure Remix for Base Sepolia**
   - Left panel → Select "Solidity Compiler"
   - Set compiler version to `0.8.19`
   - Compile the contract

4. **Deploy the contract**
   - Left panel → Select "Deploy & Run Transactions"
   - Environment: Select "Injected Provider - MetaMask"
   - Network: Switch MetaMask to **Base Sepolia Testnet**
   - Contract: Select "JumpGame"
   - Click "Deploy"
   - Approve the transaction in MetaMask

5. **Copy the contract address**
   - After deployment, copy the deployed contract address
   - Format: `0x...` (40 hex characters)

### Option B: Using Hardhat (Advanced)

```bash
# Setup Hardhat project
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat

# Create contracts folder and copy JumpGame.sol
mkdir contracts
cp contract/JumpGame.sol contracts/

# Deploy
npx hardhat run scripts/deploy.js --network base-sepolia
```

---

## Phase 2: Update Frontend with Contract Address

1. **Open** [frontend/wallet.js](frontend/wallet.js)

2. **Find line 10:**
   ```javascript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```

3. **Replace with your deployed address:**
   ```javascript
   const CONTRACT_ADDRESS = "0x<your-contract-address-here>";
   ```

4. **Commit and push to GitHub**
   ```bash
   git add frontend/wallet.js
   git commit -m "Deploy smart contract to Base Sepolia - update contract address"
   git push origin main
   ```

---

## Phase 3: Deploy Backend to Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub (easier deployment)

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `base-jump-game`
3. Configure:
   - **Name:** `base-jump-game-backend`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Branch:** main

### Step 3: Set Environment Variables
1. In Render dashboard, go to "Environment" tab
2. Add variables (if needed):
   - `NODE_ENV=production`
   - `PORT=3000` (default, optional)

### Step 4: Deploy
- Click "Create Web Service"
- Render will automatically deploy
- Copy your URL: `https://base-jump-game-backend.onrender.com`

---

## Phase 4: Update Frontend with Backend URL

1. **Open** [frontend/wallet.js](frontend/wallet.js)

2. **Find the function:**
   ```javascript
   function getLeaderboardAPI() { ... }
   ```

3. **Update the Render URL:**
   ```javascript
   return "https://base-jump-game-backend.onrender.com";
   ```

4. **Update** [frontend/leaderboard.html](frontend/leaderboard.html)
5. **Find:** `const API_URL = ...`
6. **Replace with:** `const API_URL = "https://base-jump-game-backend.onrender.com";`

7. **Commit and push**
   ```bash
   git add frontend/wallet.js frontend/leaderboard.html
   git commit -m "Update backend API URL for production deployment"
   git push origin main
   ```

---

## Phase 5: Verify Deployments

### Test Smart Contract
```bash
# In browser console at http://localhost:8000
console.log("Contract Address:", CONTRACT_ADDRESS);
console.log("Contract ABI loaded:", JUMP_GAME_ABI.length > 0);
```

### Test Backend API
```bash
# Replace with your Render URL
curl https://base-jump-game-backend.onrender.com/api/health
# Expected: {"status":"ok"}

curl https://base-jump-game-backend.onrender.com/api/leaderboard
# Expected: {"leaderboard":[...]}
```

---

## Complete Flow Checklist

- [ ] Smart contract deployed to Base Sepolia
- [ ] Contract address copied
- [ ] Frontend updated with contract address
- [ ] Changes pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend URL working
- [ ] Frontend updated with backend URL
- [ ] All changes pushed to GitHub
- [ ] Vercel frontend auto-deployed
- [ ] Test wallet connection
- [ ] Test playing game
- [ ] Test leaderboard submission

---

## Troubleshooting

### Smart Contract won't deploy
- Ensure MetaMask is on **Base Sepolia** network
- Check account has testnet ETH (get from faucet.base.org)
- Verify Solidity version is 0.8.19

### Backend deployment fails
- Check `package.json` exists in backend/
- Verify all npm dependencies are listed
- Check build logs in Render dashboard

### Contract calls failing
- Verify contract address is correct (no typos)
- Ensure you're on Base Sepolia network
- Check ABI matches contract version
