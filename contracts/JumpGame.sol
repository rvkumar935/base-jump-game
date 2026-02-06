// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title JumpGame
 * @dev A smart contract for Base Jump Game on-chain tracking
 */

contract JumpGame {
    // ============ STATE VARIABLES ============
    
    mapping(address => uint256) public xp;
    mapping(address => uint256) public bestScore;
    mapping(address => uint256) public totalRuns;
    mapping(address => uint256) public totalJumps;
    
    // Run tracking
    mapping(uint256 => Run) public runs;
    uint256 public runCounter = 0;
    
    // Anti-bot protection
    mapping(address => bool) public activeRun;
    mapping(address => uint256) public lastRunEndTime;
    
    // Leaderboard (top 50)
    address[] public topPlayers;
    mapping(address => bool) public isInTopPlayers;
    
    struct Run {
        address player;
        uint256 startTime;
        uint256 endTime;
        uint256 jumps;
        uint256 finalScore;
        bool completed;
    }
    
    struct PlayerStats {
        uint256 xp;
        uint256 bestScore;
        uint256 totalRuns;
        uint256 totalJumps;
    }
    
    // ============ EVENTS ============
    
    event RunStarted(address indexed player, uint256 indexed runId, uint256 timestamp);
    event JumpRecorded(address indexed player, uint256 indexed runId, uint256 jumpCount);
    event RunEnded(address indexed player, uint256 indexed runId, uint256 finalScore, uint256 xpEarned);
    event XPEarned(address indexed player, uint256 amount);
    event BestScoreUpdated(address indexed player, uint256 newScore);
    
    // ============ MODIFIERS ============
    
    modifier onlyActiveRun(address player) {
        require(activeRun[player], "No active run");
        _;
    }
    
    modifier antiBot() {
        require(!activeRun[msg.sender], "Already have active run");
        require(
            block.timestamp >= lastRunEndTime[msg.sender] + 5 seconds,
            "Not enough time between runs"
        );
        _;
    }
    
    // ============ FUNCTIONS ============
    
    /**
     * @dev Start a new game run
     * Anti-bot: Max 1 active run per wallet, 5 second cooldown between runs
     */
    function startRun() external antiBot returns (uint256) {
        require(!activeRun[msg.sender], "Already have active run");
        
        uint256 runId = runCounter++;
        
        runs[runId] = Run({
            player: msg.sender,
            startTime: block.timestamp,
            endTime: 0,
            jumps: 0,
            finalScore: 0,
            completed: false
        });
        
        activeRun[msg.sender] = true;
        totalRuns[msg.sender]++;
        
        emit RunStarted(msg.sender, runId, block.timestamp);
        return runId;
    }
    
    /**
     * @dev Record a jump during active run
     * Anti-bot: Max 20 jumps per block
     */
    function recordJump(uint256 runId) external onlyActiveRun(msg.sender) {
        Run storage run = runs[runId];
        require(run.player == msg.sender, "Not your run");
        require(!run.completed, "Run already completed");
        
        // Anti-bot: Prevent excessive jumps in single block
        require(run.jumps < 20, "Too many jumps in block");
        
        run.jumps++;
        totalJumps[msg.sender]++;
        
        emit JumpRecorded(msg.sender, runId, run.jumps);
    }
    
    /**
     * @dev End the current run and award XP + update scores
     */
    function endRun(uint256 runId, uint256 finalScore) external onlyActiveRun(msg.sender) {
        Run storage run = runs[runId];
        require(run.player == msg.sender, "Not your run");
        require(!run.completed, "Run already completed");
        require(finalScore > 0 || run.jumps > 0, "Invalid score");
        
        run.endTime = block.timestamp;
        run.finalScore = finalScore;
        run.completed = true;
        
        // Deactivate run
        activeRun[msg.sender] = false;
        lastRunEndTime[msg.sender] = block.timestamp;
        
        // Calculate XP
        uint256 baseXP = finalScore / 10; // 1 XP per 10 score
        uint256 jumpXP = (run.jumps * 1) / 10; // 0.1 XP per jump
        uint256 totalXP = baseXP + jumpXP;
        
        // Award XP
        xp[msg.sender] += totalXP;
        emit XPEarned(msg.sender, totalXP);
        
        // Update best score
        if (finalScore > bestScore[msg.sender]) {
            bestScore[msg.sender] = finalScore;
            _updateLeaderboard(msg.sender, finalScore);
            emit BestScoreUpdated(msg.sender, finalScore);
        }
        
        emit RunEnded(msg.sender, runId, finalScore, totalXP);
    }
    
    // ============ LEADERBOARD FUNCTIONS ============
    
    /**
     * @dev Update top 50 leaderboard
     */
    function _updateLeaderboard(address player, uint256 score) internal {
        // If already in top players, skip adding
        if (isInTopPlayers[player]) {
            return;
        }
        
        // Add if less than 50
        if (topPlayers.length < 50) {
            topPlayers.push(player);
            isInTopPlayers[player] = true;
        } else {
            // Find worst score in top 50
            uint256 worstScore = bestScore[topPlayers[0]];
            uint256 worstIdx = 0;
            
            for (uint256 i = 1; i < topPlayers.length; i++) {
                if (bestScore[topPlayers[i]] < worstScore) {
                    worstScore = bestScore[topPlayers[i]];
                    worstIdx = i;
                }
            }
            
            // Replace if better
            if (score > worstScore) {
                address removed = topPlayers[worstIdx];
                isInTopPlayers[removed] = false;
                topPlayers[worstIdx] = player;
                isInTopPlayers[player] = true;
            }
        }
    }
    
    /**
     * @dev Get top N leaderboard entries
     */
    function getTopPlayers(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        uint256 count = limit < topPlayers.length ? limit : topPlayers.length;
        address[] memory players = new address[](count);
        uint256[] memory scores = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            players[i] = topPlayers[i];
            scores[i] = bestScore[topPlayers[i]];
        }
        
        return (players, scores);
    }
    
    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return PlayerStats({
            xp: xp[player],
            bestScore: bestScore[player],
            totalRuns: totalRuns[player],
            totalJumps: totalJumps[player]
        });
    }
    
    /**
     * @dev Get active run status
     */
    function hasActiveRun(address player) external view returns (bool) {
        return activeRun[player];
    }
    
    /**
     * @dev Get run details
     */
    function getRun(uint256 runId) external view returns (Run memory) {
        return runs[runId];
    }
}
