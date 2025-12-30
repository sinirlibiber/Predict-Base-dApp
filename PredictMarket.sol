// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictMarket {
    struct Market {
        uint256 id;
        string question;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = Yes, false = No
        uint256 yesAmount;
        uint256 noAmount;
        address creator;
    }

    struct Bet {
        uint256 amount;
        bool choice; // true = Yes, false = No
        bool claimed;
    }

    uint256 public marketCount;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Bet)) public bets;
    mapping(uint256 => address[]) public marketBettors;

    event MarketCreated(uint256 indexed marketId, string question, uint256 endTime, address creator);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, bool choice, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed winner, uint256 amount);

    modifier marketExists(uint256 _marketId) {
        require(_marketId < marketCount, "Market does not exist");
        _;
    }

    modifier marketActive(uint256 _marketId) {
        require(!markets[_marketId].resolved, "Market already resolved");
        require(block.timestamp < markets[_marketId].endTime, "Market has ended");
        _;
    }

    modifier onlyCreator(uint256 _marketId) {
        require(markets[_marketId].creator == msg.sender, "Only creator can resolve");
        _;
    }

    function createMarket(string memory _question, uint256 _endTime) external returns (uint256) {
        require(_endTime > block.timestamp, "End time must be in the future");
        require(bytes(_question).length > 0, "Question cannot be empty");

        uint256 marketId = marketCount++;
        
        markets[marketId] = Market({
            id: marketId,
            question: _question,
            endTime: _endTime,
            resolved: false,
            outcome: false,
            yesAmount: 0,
            noAmount: 0,
            creator: msg.sender
        });

        emit MarketCreated(marketId, _question, _endTime, msg.sender);
        return marketId;
    }

    function bet(uint256 _marketId, bool _choice) 
        external 
        payable 
        marketExists(_marketId) 
        marketActive(_marketId) 
    {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(bets[_marketId][msg.sender].amount == 0, "Already placed a bet");

        Market storage market = markets[_marketId];
        
        if (_choice) {
            market.yesAmount += msg.value;
        } else {
            market.noAmount += msg.value;
        }

        bets[_marketId][msg.sender] = Bet({
            amount: msg.value,
            choice: _choice,
            claimed: false
        });

        marketBettors[_marketId].push(msg.sender);

        emit BetPlaced(_marketId, msg.sender, _choice, msg.value);
    }

    function resolveMarket(uint256 _marketId, bool _outcome) 
        external 
        marketExists(_marketId) 
        onlyCreator(_marketId) 
    {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(block.timestamp >= market.endTime, "Market has not ended yet");

        market.resolved = true;
        market.outcome = _outcome;

        emit MarketResolved(_marketId, _outcome);
    }

    function claimWinnings(uint256 _marketId) external marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");

        Bet storage userBet = bets[_marketId][msg.sender];
        require(userBet.amount > 0, "No bet placed");
        require(!userBet.claimed, "Winnings already claimed");
        require(userBet.choice == market.outcome, "Not a winner");

        uint256 totalWinningPool = market.outcome ? market.yesAmount : market.noAmount;
        uint256 totalLosingPool = market.outcome ? market.noAmount : market.yesAmount;
        
        // Calculate winnings: user's share of losing pool + original bet
        uint256 winnings = userBet.amount + (userBet.amount * totalLosingPool / totalWinningPool);
        
        userBet.claimed = true;

        (bool success, ) = payable(msg.sender).call{value: winnings}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(_marketId, msg.sender, winnings);
    }

    function getMarket(uint256 _marketId) 
        external 
        view 
        marketExists(_marketId) 
        returns (Market memory) 
    {
        return markets[_marketId];
    }

    function getUserBet(uint256 _marketId, address _user) 
        external 
        view 
        marketExists(_marketId) 
        returns (Bet memory) 
    {
        return bets[_marketId][_user];
    }

    function getActiveMarkets() external view returns (Market[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < marketCount; i++) {
            if (!markets[i].resolved && block.timestamp < markets[i].endTime) {
                activeCount++;
            }
        }

        Market[] memory activeMarkets = new Market[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < marketCount; i++) {
            if (!markets[i].resolved && block.timestamp < markets[i].endTime) {
                activeMarkets[index] = markets[i];
                index++;
            }
        }

        return activeMarkets;
    }

    function getAllMarkets() external view returns (Market[] memory) {
        Market[] memory allMarkets = new Market[](marketCount);
        
        for (uint256 i = 0; i < marketCount; i++) {
            allMarkets[i] = markets[i];
        }

        return allMarkets;
    }
}
