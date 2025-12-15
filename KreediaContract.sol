// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KreediaContract is ERC721, Ownable {
    uint256 private _nextTokenId;
    
    // Payment tracking
    mapping(address => mapping(address => uint256)) public workerTotalEarned;
    
    struct Mission {
        address token;
        uint256 amount;
        address ngo;
        address worker;
        bool locked;
        bool completed;
        uint256 beforeNFTId;
        uint256 afterNFTId;
        uint256 timestamp;
    }

    mapping(address => bool) public acceptedTokens;
    mapping(string => Mission) public missions;
    
    // Simple NFT metadata
    mapping(uint256 => string) public tokenToMission;
    mapping(uint256 => uint8) public tokenPhotoType; // 0 = BEFORE, 1 = AFTER
    mapping(address => mapping(string => bool)) public userMissionNFT;

    event TokenAdded(address token);
    event TokenRemoved(address token);
    event MissionCreated(string missionId, address worker, address ngo, uint256 amount);
    event MissionCompleted(string missionId, address worker, uint256 workerReward, uint256 beforeNFT, uint256 afterNFT);
    event NFTMinted(uint256 tokenId, string missionId, address worker, uint8 photoType);
    event MissionCanceled(string missionId);

    error InvalidToken();
    error InvalidAmount();
    error MissionNotFound();
    error MissionAlreadyExists();
    error MissionNotLocked();
    error MissionAlreadyCompleted();
    error InvalidEntry(string message);
    error FailedToLockFunds();

    constructor(address initialOwner) ERC721("Kreedia Impact NFT", "KREEDIA") Ownable(initialOwner) {
        _nextTokenId = 1;
    }

    modifier validToken(address token) {
        if (!acceptedTokens[token]) revert InvalidToken();
        _;
    }

    modifier missionExists(string memory missionId) {
        if (missions[missionId].amount == 0) revert MissionNotFound();
        _;
    }

    // =============================================================================
    // TOKEN MANAGEMENT
    // =============================================================================

    // This function will be used to add accepted stable coins addresses for payments
    function addToken(address token) external onlyOwner {
        acceptedTokens[token] = true;
        emit TokenAdded(token);
    }

    // This function will be used to remove accepted stable coins addresses for payments
    function removeToken(address token) external onlyOwner {
        acceptedTokens[token] = false;
        emit TokenRemoved(token);
    }

    // =============================================================================
    // MISSION MANAGEMENT
    // =============================================================================

    // This function will be used for money locking and before NFT minting whan the mission is accepted by a NGO
    function createMission(
        string memory missionId,
        address token,
        uint256 amount,
        address worker
    ) external validToken(token) returns (uint256 beforeNFTId) {
        if (amount <= 0) revert InvalidAmount();
        if (missions[missionId].amount != 0) revert MissionAlreadyExists();

        uint256 ngoBalance = IERC20(token).balanceOf(msg.sender);
        if (ngoBalance < amount) revert InvalidAmount();

        // Transfer tokens to contract
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if (!success) revert FailedToLockFunds();

        // Mint BEFORE NFT immediately
        beforeNFTId = _mintNFT(worker, missionId, 0); // 0 = BEFORE

        // Create mission
        missions[missionId] = Mission({
            token: token,
            amount: amount,
            ngo: msg.sender,
            worker: worker,
            locked: true,
            completed: false,
            beforeNFTId: beforeNFTId,
            afterNFTId: 0,
            timestamp: block.timestamp
        });

        userMissionNFT[worker][missionId] = true;
        emit MissionCreated(missionId, worker, msg.sender, amount);
        
        return beforeNFTId;
    }

    function completeMission(
        string memory missionId
    ) external missionExists(missionId) returns (uint256 afterNFTId) {
        Mission storage mission = missions[missionId];
        if (!mission.locked) revert MissionNotLocked();
        if (mission.completed) revert MissionAlreadyCompleted();

        // Mint AFTER NFT
        afterNFTId = _mintNFT(mission.worker, missionId, 1); // 1 = AFTER
        
        // Update mission
        mission.afterNFTId = afterNFTId;
        mission.completed = true;
        mission.locked = false;

        // Calculate and distribute rewards
        uint256 totalAmount = mission.amount;
        uint256 workerReward = (totalAmount * 96) / 100; // 76% to worker
        // 4% platform fee remains in contract

        // Transfer rewards
        IERC20(mission.token).transfer(mission.worker, workerReward);

        // Update worker earnings
        workerTotalEarned[mission.worker][mission.token] += workerReward;

        emit MissionCompleted(missionId, mission.worker, workerReward, mission.beforeNFTId, afterNFTId);
        
        return afterNFTId;
    }

    function cancelMission(string memory missionId) external missionExists(missionId) {
        Mission storage mission = missions[missionId];
        if (!mission.locked) revert MissionNotLocked();

        mission.locked = false;
        IERC20(mission.token).transfer(mission.ngo, mission.amount);
        emit MissionCanceled(missionId);
    }

    // =============================================================================
    // NFT FUNCTIONS
    // =============================================================================

    function _mintNFT(
        address to,
        string memory missionId,
        uint8 photoType
    ) internal returns (uint256) {
        if (to == address(0)) revert InvalidToken();
        if (bytes(missionId).length == 0) revert InvalidEntry("Mission ID is required");
        if (photoType > 1) revert InvalidEntry("Invalid photo type");

        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        
        tokenToMission[tokenId] = missionId;
        tokenPhotoType[tokenId] = photoType;
        
        emit NFTMinted(tokenId, missionId, to, photoType);
        
        return tokenId;
    }

    function getNFTDetails(uint256 tokenId) external view returns (
        string memory missionId,
        uint8 photoType,
        address owner
    ) {
        return (
            tokenToMission[tokenId],
            tokenPhotoType[tokenId],
            ownerOf(tokenId)
        );
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    function getMissionDetails(string memory missionId) external view returns (Mission memory) {
        return missions[missionId];
    }

    function getMissionProgress(string memory missionId) external view returns (
        bool exists,
        bool locked,
        bool completed,
        uint256 beforeNFTId,
        uint256 afterNFTId
    ) {
        Mission memory mission = missions[missionId];
        return (
            mission.amount > 0,
            mission.locked,
            mission.completed,
            mission.beforeNFTId,
            mission.afterNFTId
        );
    }

    function hasUserMissionNFT(address user, string memory missionId) external view returns (bool) {
        return userMissionNFT[user][missionId];
    }

    // =============================================================================
    // PLATFORM FUNCTIONS
    // =============================================================================

    function withdrawPlatformFees(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(token).transfer(owner(), balance);
        }
    }

    // Get total NFTs minted
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
