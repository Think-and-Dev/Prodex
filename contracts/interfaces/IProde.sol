// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IProde {
    struct Event {
        bool active;
        uint8 eventOutcome;
        string name;
        uint256 thresholdInit;
        uint256 thresholdEnd;
        uint256 blockInit;
        uint256 blockEnd;
        uint256 poolSize;
        address[] betTeamA;
        address[] betTeamB;
        address[] betDraw;
        EventState state;
    }

    enum EventState {
        CREATED,
        ACTIVE,
        ORACLE,
        UPDATING,
        FINISHED
    }

    enum BetOdd {
        TEAM_A,
        DRAW,
        TEAM_B
    }

    event Initialized(
        address token,
        address NGO,
        address oracle,
        uint256 NGODonationPercentage,
        uint256 maxEvents,
        uint256 minWinnerPoints
    );
    event MinWinnerPointsUpdated(uint256 oldMinPoints, uint256 newMinPoints);
    event EventCreated(uint256 eventId);
    event EventActive(uint256 eventId, uint256 blockInit, uint256 blockEnd);
    event BetPlaced(uint256 eventId, address indexed who, BetOdd bet, uint256 amount);
    event EventBetsFinished(uint256 eventId);
    event EventOutcome(uint256 eventId, uint8 result);
    event UpdateWinnersEvent(uint256 eventId, uint256 amountOfWinners);
    event ClaimPrize(address indexed who, address indexed to);
    event PrizesSet(uint256 ngoPrize, uint256 winnerPrize, uint256 totalAmountToShare, uint256 winners);
    event ClaimNGO(uint256 ngoPrize);

    /********** SETTERS ***********/
    function setMinWinnerPoints(uint256 _newMinWinnerPoints) external;

    /********** GETTERS ***********/

    function getNGOCurrentPoolPrize() external view returns (uint256);

    /********** INTERFACE ***********/

    function addEvent(Event memory _event) external returns (uint256);

    /**TODO SATURDAY */
    function addEvents(Event[] memory _events) external;

    function startEvent(uint256 eventId) external;

    function stopEventBetWindow(uint256 eventId) external;

    function pokeOracle(uint256 eventId) external;

    function updateResults(uint256 eventId) external;

    function getEventWinners(uint256 eventId) external view returns (address[] memory);

    function placeBet(
        uint256 eventId,
        BetOdd bet,
        uint256 amount
    ) external;

    function setPrizes() external;

    function claimPrize(address to) external;

    function claimONG() external;

    function isWinner(address user) external view returns (bool);
}
