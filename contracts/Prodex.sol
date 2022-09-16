// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * STRUCTS DEFINED
mapping(address => uint256) hitters;
Uint256 minWinnerPoints = 20
Uint256 winners;
mapping(uint256 =>SportEvent) eventos; 
Uint256 lastEventProcessd = 1 ; 
Uint256 lastIndexAddressWinnerProcessed = 20; 
mapping(uint256 =>SportEvent) eventos; 
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IProde.sol";

contract Prodex is IProde, Ownable{
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    uint256 public winners;
    uint256 public poolSize;
    uint256 public immutable maxEvents;
    uint256 public minWinnerPoints;

    Counters.Counter private _eventIdCounter;

    mapping(address=>uint256) public hitters;
    mapping(uint256 => Event) public events;
    
    
    event Initialized(uint256 maxEvents,uint256 minWinnerPoints);
    event MinWinnerPointsUpdated(uint256 oldMinPoints,uint256 newMinPoints);
    event EventCreated(uint256 eventId);
    event EventActive(uint256 eventId,uint256 blockInit, uint256 blockEnd);

    struct Event {
        bool active;
        string name;
        uint256 thresholdInit;
        uint256 thresholdEnd;
        uint256 blockInit;
        uint256 blockEnd;
        uint256 poolSize;
        address [] betTeamA;
        address [] betTeamB;
        address [] betDraw;
        EventState state;
    }

    constructor(uint256 _maxEvents,uint256 _minWinnerPoints){
        require(minWinnerPoints > 0, "INVALID MIN WINNER POINTS");
        maxEvents = _maxEvents;
        minWinnerPoints = _minWinnerPoints;
        emit Initialized(maxEvents,minWinnerPoints);
    }

    /********** SETTERS ***********/
    function setMinWinnerPoints(uint256 _newMinWinnerPoints) external onlyOwner{
        require(_newMinWinnerPoints > 0, "INVALID MIN WINNER POINTS");
        uint256 oldMinnerPoints = _newMinWinnerPoints;
        minWinnerPoints = _newMinWinnerPoints;
        emit MinWinnerPointsUpdated(oldMinnerPoints,minWinnerPoints);
    }

    /********** GETTERS ***********/

    /********** INTERFACE ***********/

    function validateEventCreation(Event memory _event) internal{
        require(_event.blockInit > block.timestamp, "PRODEX: INIT BLOCK MUST BE GREATER THAN CURRENT BLOCK");
        require(_event.blockEnd > block.timestamp, "PRODEX: END BLOCK MUST BE GREATER THAN CURRENT BLOCK");
        require(_event.blockEnd >= _event.blockInit, "PRODEX: MATCH CANNOT END BEFORE MATCH INITIALIZATION");
        require(_event.betTeamA.length == 0, "PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION");
        require(_event.betTeamB.length == 0, "PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION");
        require(_event.betDraw.length  == 0, "PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION");
    }

    function addEvent(Event memory _event) external onlyOwner returns(uint256) {
        uint256 currentEventId = _eventIdCounter.current();
        require(currentEventId < maxEvents, "PRODEX: CANNOT ADD MORE EVENTS");
        _eventIdCounter.increment();
        uint256 newEventId = _eventIdCounter.current();
        validateEventCreation(_event);
        _event.active = false;
        _event.poolSize = 0;
        _event.state = EventState.CREATED;
        events[newEventId] = _event;
        emit EventCreated(newEventId);
    }

    /**TODO SATURDAY */
    function addEvents(Event[] memory _events) external onlyOwner {
        
    }

    function startEvent(uint256 eventId) external {
        require(eventId <= maxEvents, "PRODEX: INVALID EVENT ID");
        require(!events[eventId].active,"PRODEX: EVENT ALREADY INITIATED");
        require(block.timestamp >= events[eventId].blockInit, "PRODEX: CANNOT INIT EVENT YET");
        events[eventId].active = true;
        events[eventId].state = EventState.ACTIVE;
        emit EventActive(eventId,events[eventId].blockInit,events[eventId].blockEnd);
    }

    function stopEventBetWindow() external {

    }

    function finishEvent() external{
        
    }

    function bet(uint256 eventId) public {

    }

}
