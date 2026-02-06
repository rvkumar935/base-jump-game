let userAddress;
let provider;
let signer;
let jumpGameContract;
let leaderboardClient;
let isMiniApp = false;
let miniAppType = null; // 'farcaster' or 'base'

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Deploy first, then update
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

// Get leaderboard API URL - works in both browser and Node.js
function getLeaderboardAPI() {
  // Try window context first (browser)
  if (typeof window !== 'undefined' && window.LEADERBOARD_API) {
    return window.LEADERBOARD_API;
  }
  // Try process.env (Node.js/build time)
  if (typeof process !== 'undefined' && process.env?.REACT_APP_LEADERBOARD_API) {
    return process.env.REACT_APP_LEADERBOARD_API;
  }
  // Default
  return "http://localhost:3000";
}

const LEADERBOARD_API = getLeaderboardAPI();

// Wait for ethers to be loaded (synchronous for backwards compat)
function waitForEthers(callback, attempts = 0) {
  if (typeof ethers !== 'undefined') {
    callback();
  } else if (attempts < 100) {
    setTimeout(() => waitForEthers(callback, attempts + 1), 50);
  } else {
    console.error('❌ ethers.js failed to load after 5 seconds');
    alert('❌ Failed to load ethers.js library. Please reload the page.');
  }
}

// Wait for ethers - async version FIXED
async function waitForEthersAsync(attempts = 0) {
  if (typeof ethers !== 'undefined') {
    return true;
  }
  if (attempts >= 100) {
    throw new Error('ethers.js failed to load after 5 seconds');
  }
  await new Promise(resolve => setTimeout(resolve, 50));
  return await waitForEthersAsync(attempts + 1);
}

// Detect mini app environment
function detectMiniAppEnvironment() {
  // Check for Farcaster Frames/mini app
  if (window.parent !== window || window.location.pathname.includes('/frames')) {
    if (window.farcasterMessenger) {
      isMiniApp = true;
      miniAppType = 'farcaster';
      console.log('🎭 Farcaster mini app detected');
      return true;
    }
  }

  // Check for Base mini app (injected context)
  if (window.ethereum?.isBase || window.ethereum?.isCoinbaseWallet) {
    return false; // Will use standard MetaMask flow
  }

  // Check for Degen Chain (Farcaster context)
  if (document.currentScript?.src?.includes('farcaster')) {
    isMiniApp = true;
    miniAppType = 'farcaster';
    return true;
  }

  return false;
}

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
  try {
    // Wait for ethers to be available
    await waitForEthersAsync();
    
    detectMiniAppEnvironment();

    // Try Farcaster/mini app first if detected
    if (isMiniApp && miniAppType === 'farcaster') {
      await connectFarcasterWallet();
      return;
    }

    // Standard MetaMask/EIP-1193 flow
    if (!window.ethereum) {
      alert("❌ Install MetaMask, Coinbase Wallet, or use a mini app");
      return;
    }

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

    // Initialize ethers.js with BrowserProvider (ethers v6)
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

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

    // Update UI immediately (before any alerts/modals)
    updateWalletStatus();
    console.log("✅ Wallet connected: " + userAddress.slice(0, 6) + "..." + userAddress.slice(-4));
    
    // Show alert after UI updates
    setTimeout(() => {
      alert("✅ Wallet connected: " + userAddress.slice(0, 6) + "..." + userAddress.slice(-4));
    }, 100);
  } catch (error) {
    console.error("❌ Wallet connection failed:", error);
    alert("Failed to connect wallet: " + error.message);
  }
}

// Farcaster mini app wallet connection
async function connectFarcasterWallet() {
  try {
    // Ensure ethers is available
    await waitForEthersAsync();
    
    // For Farcaster frames, we typically get user context from the frame
    // This requires the frame to provide the user's FID and signature
    
    if (!window.farcasterMessenger?.user?.address) {
      // Fallback: try to get from Degen chain provider if available
      if (!window.ethereum) {
        alert("❌ Farcaster wallet not available in this context");
        return;
      }
      
      // Use injected provider from Farcaster frame
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      userAddress = accounts[0];
    } else {
      userAddress = window.farcasterMessenger.user.address;
    }

    // Initialize ethers.js with Farcaster's provider or RPC fallback
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
    }
    signer = await provider.getSigner();

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
    console.log("✅ Farcaster wallet connected:", userAddress);
  } catch (error) {
    console.error("❌ Farcaster wallet connection failed:", error);
    throw error;
  }
}

function updateWalletStatus() {
  const statusEl = document.getElementById("wallet-status");
  const connectBtn = document.getElementById("connect");
  
  console.log("Updating wallet status. Connected:", !!userAddress);
  
  if (!connectBtn) {
    console.error("❌ Connect button not found in DOM!");
    return;
  }
  
  if (userAddress) {
    // Update status display
    if (statusEl) {
      const displayAddress = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
      statusEl.innerText = "✅ Connected: " + displayAddress;
      statusEl.style.color = "#00ff00";
      console.log("Status updated to: Connected", displayAddress);
    }
    
    // Update button to show address and allow disconnect
    const displayAddress = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    connectBtn.innerText = `Disconnect (${displayAddress})`;
    connectBtn.style.background = "#ff6b6b";
    connectBtn.style.color = "#ffffff";
    connectBtn.style.cursor = "pointer";
    connectBtn.onclick = disconnectWallet;  // ALWAYS SET HANDLER
    console.log("✅ Button updated to disconnect mode");
  } else {
    // Not connected - show connect button
    if (statusEl) {
      statusEl.innerText = "Not connected";
      statusEl.style.color = "#888";
    }
    
    connectBtn.innerText = "Connect Wallet";
    connectBtn.style.background = "#00ff00";
    connectBtn.style.color = "#000";
    connectBtn.style.cursor = "pointer";
    connectBtn.onclick = connectWallet;  // ALWAYS SET HANDLER
    console.log("✅ Button reset to connect mode");
  }
}

function disconnectWallet() {
  console.log("Disconnecting wallet...");
  userAddress = null;
  provider = null;
  signer = null;
  jumpGameContract = null;
  leaderboardClient = null;
  
  // Force reinitialize button handlers
  const connectBtn = document.getElementById("connect");
  if (connectBtn) {
    connectBtn.onclick = connectWallet;
  }
  
  updateWalletStatus();
  console.log("Wallet disconnected");
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

// Initialize on page load
function initializeWallet() {
  detectMiniAppEnvironment();
  console.log(`Environment: ${isMiniApp ? miniAppType + ' mini app' : 'standard web'}`);
  
  // Set connect button handler and update status
  updateWalletStatus();
  
  const connectBtn = document.getElementById("connect");
  if (connectBtn) {
    console.log('✅ Connect button initialized and ready');
  } else {
    console.warn('⚠️ Connect button not found in DOM');
  }
}

// Initialize once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWallet);
} else {
  // DOM already loaded
  initializeWallet();
}

// Handle network changes - DON'T reload on accountsChanged
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("Accounts changed:", accounts);
    if (accounts.length === 0) {
      // User disconnected wallet
      console.log("User disconnected wallet");
      userAddress = null;
      updateWalletStatus();
    } else {
      // User switched accounts
      userAddress = accounts[0];
      console.log("Switched to account:", userAddress);
      updateWalletStatus();
    }
  });

  window.ethereum.on("chainChanged", () => {
    console.log("Chain changed, reloading...");
    location.reload();
  });
}

