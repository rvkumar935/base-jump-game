let userAddress;
let provider;
let signer;
let jumpGameContract;
let leaderboardClient;

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Deploy first, then update
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";
const LEADERBOARD_API = "http://localhost:3000"; // Update for production

// Minimal JumpGame ABI
const JUMP_GAME_ABI = [
  {
    "inputs": [],
    "name": "startRun",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "runId", "type": "uint256"}],
    "name": "recordJump",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "runId", "type": "uint256"},
      {"internalType": "uint256", "name": "finalScore", "type": "uint256"}
    ],
    "name": "endRun",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
    "name": "getPlayerStats",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "xp", "type": "uint256"},
          {"internalType": "uint256", "name": "bestScore", "type": "uint256"},
          {"internalType": "uint256", "name": "totalRuns", "type": "uint256"},
          {"internalType": "uint256", "name": "totalJumps", "type": "uint256"}
        ],
        "internalType": "struct JumpGame.PlayerStats",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getTopPlayers",
    "outputs": [
      {"internalType": "address[]", "name": "", "type": "address[]"},
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("❌ Install MetaMask or Coinbase Wallet");
    return;
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    userAddress = accounts[0];

    // Check if on Base Sepolia testnet (ChainId: 84532)
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId !== "0x14a34") { // 84532 in hex
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }],
        });
      } catch (error) {
        // If chain not added, try to add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x14a34",
                  chainName: "Base Sepolia",
                  rpcUrls: ["https://sepolia.base.org"],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
          } catch (addError) {
            alert("Failed to add Base Sepolia network");
            return;
          }
        }
      }
    }

    // Initialize ethers.js
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    // Initialize contract
    if (CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
      jumpGameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        JUMP_GAME_ABI,
        signer
      );
    }

    // Initialize leaderboard client
    leaderboardClient = new LeaderboardClient(LEADERBOARD_API);

    updateWalletStatus();
    alert("✅ Wallet connected: " + userAddress.slice(0, 6) + "..." + userAddress.slice(-4));
  } catch (error) {
    console.error("❌ Wallet connection failed:", error);
    alert("Failed to connect wallet: " + error.message);
  }
}

function updateWalletStatus() {
  const statusEl = document.getElementById("wallet-status");
  if (statusEl && userAddress) {
    statusEl.innerText = "✅ Connected: " + userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    statusEl.style.color = "#00ff00";
  }
}

// Contract interaction functions
async function startRun(player) {
  if (!jumpGameContract) {
    throw new Error("Contract not initialized. Please deploy and configure.");
  }

  try {
    const tx = await jumpGameContract.startRun();
    const receipt = await tx.wait();
    
    // Extract runId from transaction
    const event = receipt.events?.find(e => e.event === 'RunStarted');
    return event ? event.args.runId.toNumber() : 0;
  } catch (error) {
    console.error("Error starting run:", error);
    throw error;
  }
}

async function recordJump(runId) {
  if (!jumpGameContract) {
    throw new Error("Contract not initialized");
  }

  try {
    const tx = await jumpGameContract.recordJump(runId);
    await tx.wait();
  } catch (error) {
    console.error("Error recording jump:", error);
    throw error;
  }
}

async function endRun(runId, finalScore) {
  if (!jumpGameContract) {
    throw new Error("Contract not initialized");
  }

  try {
    const tx = await jumpGameContract.endRun(runId, finalScore);
    await tx.wait();

    // Calculate XP
    const baseXP = Math.floor(finalScore / 10);
    const totalRuns = 1; // This would typically come from contract
    const totalJumps = Math.ceil(finalScore / 10); // Estimated

    // Submit to leaderboard (non-blocking)
    if (leaderboardClient) {
      try {
        await leaderboardClient.submitScore(
          userAddress,
          finalScore,
          baseXP,
          totalRuns,
          totalJumps
        );
        console.log("✅ Score submitted to leaderboard");
      } catch (error) {
        console.warn("⚠️ Failed to submit to leaderboard:", error.message);
        // Don't throw - leaderboard is optional
      }
    }
  } catch (error) {
    console.error("Error ending run:", error);
    throw error;
  }
}

async function getPlayerStats(address) {
  if (!jumpGameContract) {
    throw new Error("Contract not initialized");
  }

  try {
    return await jumpGameContract.getPlayerStats(address);
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

async function getTopPlayers(limit = 50) {
  if (!jumpGameContract) {
    throw new Error("Contract not initialized");
  }

  try {
    const [addresses, scores] = await jumpGameContract.getTopPlayers(limit);
    return addresses.map((addr, i) => ({
      address: addr,
      score: scores[i].toNumber()
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

// Event listeners
document.getElementById("connect").onclick = connectWallet;

// Handle network changes
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    location.reload();
  });

  window.ethereum.on("chainChanged", () => {
    location.reload();
  });
}

