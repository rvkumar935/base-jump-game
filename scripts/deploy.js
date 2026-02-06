const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying JumpGame contract to Base Sepolia...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying from: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} Base ETH\n`);

  // Deploy contract
  const JumpGame = await ethers.getContractFactory("JumpGame");
  const jumpGame = await JumpGame.deploy();
  
  await jumpGame.waitForDeployment();
  
  const contractAddress = await jumpGame.getAddress();
  console.log(`✅ JumpGame deployed successfully!`);
  console.log(`📍 Contract Address: ${contractAddress}\n`);

  // Save contract address to file
  const deploymentInfo = {
    network: "Base Sepolia",
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentBlock: (await ethers.provider.getBlock()).number,
    deploymentTime: new Date().toISOString(),
    explorerUrl: `https://sepolia.basescan.org/address/${contractAddress}`,
  };

  const deploymentPath = path.join(__dirname, "../deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved to: deployment.json`);

  // Verify on explorer
  console.log(`\n🔍 View on BaseScan: ${deploymentInfo.explorerUrl}`);
  console.log("\n✨ Next steps:");
  console.log(`1. Copy this address: ${contractAddress}`);
  console.log(`2. Update frontend/wallet.js line 10 with the contract address`);
  console.log(`3. Commit and push to GitHub`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
