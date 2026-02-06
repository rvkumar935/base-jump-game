# 🚀 Manual Deployment Guide: Remix + Render

Complete guide to deploy your game without command-line tools.

---

## Part 1: Deploy Smart Contract on Remix (10 minutes)

### Step 1: Open Remix IDE

1. Go to https://remix.ethereum.org in your browser
2. You'll see a code editor with example files

---

### Step 2: Create Contract File

1. Left panel → Click the **"Create New File"** icon (+)
2. Name it: `JumpGame.sol`
3. An empty file will open

---

### Step 3: Copy Contract Code

1. Open the file: `contract/JumpGame.sol` from your project
2. Select **all code** (Ctrl/Cmd + A)
3. **Copy** it
4. Go back to Remix
5. **Paste** all code into the `JumpGame.sol` file in Remix

---

### Step 4: Compile Contract

1. Left panel → Click **"Solidity Compiler"** (⚙️)
2. Check that **Compiler Version** is set to `0.8.19`
3. Click **"Compile JumpGame.sol"** (blue button)
4. Wait for "Compilation successful" message ✅

---

### Step 5: Deploy Contract

1. Left panel → Click **"Deploy & Run Transactions"** (play icon)
2. Change **Environment** to: **"Injected Provider - MetaMask"**
3. MetaMask will pop up asking for permission → **Click "Connect"**

4. Make sure in MetaMask:
   - Network is set to **Base Sepolia** (not Ethereum Mainnet!)
   - You have some testnet ETH (check your balance)

5. Back in Remix:
   - Contract dropdown should show: **"JumpGame"**
   - Click the orange **"Deploy"** button

6. MetaMask will ask to confirm transaction:
   - **Click "Confirm"** to pay gas and deploy
   - Wait for deployment to finish (30-60 seconds)

---

### Step 6: Copy Contract Address

After deployment succeeds:
1. In Remix, look at **"Deployed Contracts"** section at the bottom
2. You'll see a contract address like: `0x12ab...cd34`
3. **Copy this address** (click the copy icon next to it)
4. **Save it somewhere** - you'll need it in Step 8

---

### ✅ Contract Deployed!

Your smart contract is now live on Base Sepolia testnet.

You can verify it at: https://sepolia.basescan.org/address/0x[your_address]

---

## Part 2: Deploy Backend on Render (5 minutes)

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Sign Up"**
3. **Sign up with GitHub** (easier!)
4. Authorize Render to access your GitHub account

---

### Step 2: Create Web Service

1. In Render dashboard, click **"New +"** (top right)
2. Select **"Web Service"**
3. Choose your repository: **`base-jump-game`**
4. Click **"Connect"**

---

### Step 3: Configure Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `base-jump-game-backend` |
| **Environment** | Select `Node` |
| **Region** | Keep default |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && node server.js` |

Click **"Create Web Service"**

---

### Step 4: Wait for Deployment

Render will:
1. Build your service (2-3 minutes)
2. Start the backend server
3. Show you a live URL like: `https://base-jump-game-backend.onrender.com`

**Copy this URL** - you'll need it next

---

### ✅ Backend Deployed!

Your backend API is now live and public.

Test it: Visit `https://base-jump-game-backend.onrender.com/api/health`

---

## Part 3: Update Frontend (5 minutes)

### Step 1: Update Contract Address

1. Open `frontend/wallet.js`
2. Find **line 10**:
   ```javascript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```
3. Replace with your Remix contract address from Step 6 above:
   ```javascript
   const CONTRACT_ADDRESS = "0x[YOUR_CONTRACT_ADDRESS]";
   ```
4. **Save the file**

---

### Step 2: Update Backend URL

1. Open `frontend/wallet.js`
2. Find the function `getLeaderboardAPI()` (around line 27)
3. Replace with your Render URL:
   ```javascript
   function getLeaderboardAPI() {
     return "https://base-jump-game-backend.onrender.com";
   }
   ```
4. **Save the file**

---

### Step 3: Update Leaderboard API

1. Open `frontend/leaderboard.html`
2. Find the line with `const API_URL = ...` (around line 15)
3. Update it:
   ```javascript
   const API_URL = "https://base-jump-game-backend.onrender.com";
   ```
4. **Save the file**

---

### Step 4: Commit & Push

```bash
git add frontend/wallet.js frontend/leaderboard.html
git commit -m "Update contract address and backend API URL"
git push origin main
```

✅ **Vercel will auto-deploy your frontend!**

---

## ✅ Deployment Complete!

Your full system is now live:

| Component | Status | URL/Info |
|-----------|--------|----------|
| **Smart Contract** | ✅ Live on Base Sepolia | `0x[your_address]` |
| **Backend API** | ✅ Live on Render | `https://base-jump-game-backend.onrender.com` |
| **Frontend** | ✅ Live on Vercel | `https://base-jump-game.vercel.app/` |

---

## 🎮 Test Your Game

1. Go to https://base-jump-game.vercel.app/
2. **Click "Connect Wallet"**
3. MetaMask will open → **Approve connection**
4. You should see your wallet address at the top
5. **Click "Play Game"** to start
6. After playing, your score can be submitted to the blockchain!

---

## 📋 Quick Checklist

- [ ] Copied `contract/JumpGame.sol` to Remix
- [ ] Set compiler to 0.8.19 and compiled successfully
- [ ] Switched MetaMask to Base Sepolia
- [ ] Have testnet ETH in wallet
- [ ] Deployed contract on Remix
- [ ] Copied contract address
- [ ] Created Render account with GitHub
- [ ] Deployed backend on Render
- [ ] Copied Render backend URL
- [ ] Updated `frontend/wallet.js` with contract address
- [ ] Updated `frontend/wallet.js` with Render URL
- [ ] Updated `frontend/leaderboard.html` with Render URL
- [ ] Pushed changes to GitHub
- [ ] Verified Vercel deployed frontend
- [ ] Tested game at https://base-jump-game.vercel.app/

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| MetaMask won't connect in Remix | Refresh page, click "Connect" again |
| "Wrong network" error | Switch MetaMask to Base Sepolia |
| "Not enough ETH" | Get testnet ETH from https://faucet.base.org |
| Render deployment fails | Check backend/package.json exists |
| Frontend still shows old URL | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Contract calls fail | Verify contract address is correct (no typos) |

---

## 🔗 Useful Links

- **Remix IDE**: https://remix.ethereum.org
- **Base Sepolia Faucet**: https://faucet.base.org
- **BaseScan Explorer**: https://sepolia.basescan.org
- **Render Dashboard**: https://dashboard.render.com
- **Your Frontend**: https://base-jump-game.vercel.app/
- **Your GitHub**: https://github.com/rvkumar935/base-jump-game

Enjoy your fully deployed Web3 game! 🚀
