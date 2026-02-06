#!/bin/bash

echo "
████████████████████████████████████████████████████████
  🎮 Base Jump Game - Smart Contract Deployment
████████████████████████████████████████████████████████

💡 IMPORTANT: You'll need your MetaMask private key to deploy.

📋 CHECKLIST before proceeding:
  ✓ MetaMask installed?
  ✓ Switched to Base Sepolia testnet?
  ✓ Have testnet ETH? (Get from https://faucet.base.org)
  ✓ Have your private key ready?

════════════════════════════════════════════════════════════
"

# Check if .env exists
if [ -f .env ]; then
  echo "✅ Found .env file"
else
  echo "
❌ .env file not found!

📝 QUICK SETUP (2 minutes):

1. Open MetaMask → Account → Settings → Security & Privacy
2. Click 'Show Private Key' → Enter password
3. Copy your private key (NO 0x prefix!)
4. Create .env file in project root with:

   PRIVATE_KEY=your_private_key_here

5. Come back here and run this script again!

════════════════════════════════════════════════════════════
  "
  exit 1
fi

echo "🔐 Checking .env..."
if grep -q "PRIVATE_KEY=your_private_key_here" .env; then
  echo "❌ Error: Replace 'your_private_key_here' with your actual private key!"
  exit 1
fi

echo "✅ .env configured"

echo "
═══════════════════════════════════════════════════════════
  🚀 READY TO DEPLOY
═══════════════════════════════════════════════════════════

Press Enter to deploy to Base Sepolia...
(You'll see the contract address when done)
"
read -r

echo "Compiling contract..."
npx hardhat compile

echo ""
echo "Deploying to Base Sepolia..."
echo "(This will cost a small amount of testnet gas)"
echo ""

npx hardhat run scripts/deploy.js --network baseSepolia

if [ $? -eq 0 ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  ✅ DEPLOYMENT SUCCESSFUL!"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  echo "📋 NEXT STEPS:"
  echo "  1. Check deployment.json for contract address"
  echo "  2. Update frontend/wallet.js line 10"
  echo "  3. Commit & push to GitHub"
  echo "  4. Then deploy backend to Render/Railway"
  echo ""
  echo "📍 View on BaseScan: Open deployment.json for explorer URL"
  echo ""
else
  echo "❌ Deployment failed. Check the error above."
  exit 1
fi
