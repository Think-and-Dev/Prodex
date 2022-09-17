// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import './interfaces/IProde.sol';
import './interfaces/IOracle.sol';
import 'hardhat/console.sol';

contract Prodex is IProde, Ownable {
  using SafeERC20 for IERC20;
  using SafeMath for uint256;

  using Counters for Counters.Counter;
  address public token;
  address public oracle;
  address public immutable NGO;
  uint256 public immutable NGODonationPercentage;
  uint256 public globalPoolSize;
  uint256 public immutable maxEvents;
  uint256 public minWinnerPoints;
  uint256 public winners;
  uint256 public winnerPrize;
  uint256 public ngoPrize;

  Counters.Counter private _eventIdCounter;
  Counters.Counter private _eventIdProcessedCounter;

  mapping(address => uint256) public hitters;
  mapping(address => uint256[]) public usersByEvent;
  mapping(uint256 => Event) public events;

  modifier validEvent(uint256 eventId) {
    require(eventId <= maxEvents && events[eventId].active, 'INVALID EVENT ID OR NOT ACTIVE');
    _;
  }

  modifier validMaxEvents(uint256 eventId) {
    require(eventId <= maxEvents, 'EVENT IS GREATER THAN MAX EVENTS NUMBER');
    _;
  }

  modifier onlyOwnerOrNGO() {
    require(msg.sender == NGO || msg.sender == this.owner(), 'PRODEX: NOT NGO OR CONTRACT OWNER');
    _;
  }

  modifier ableToClaim() {
    require(
      _eventIdProcessedCounter.current() == maxEvents,
      'PRODEX: ALL EVENTS MUST BE PROCESSED TO CLAIM PRIZE'
    );
    _;
  }


  constructor(
    address _token,
    address _ngo,
    address _oracle,
    uint256 _ngoDonationPercentage,
    uint256 _maxEvents,
    uint256 _minWinnerPoints
  ) {
    require(_token != address(0), 'INVALID TOKEN ADDRESS');
    require(_ngo != address(0), 'INVALID NGO ADDRESS');
    require(_oracle != address(0), 'INVALID ORACLE ADDRESS');
    require(_minWinnerPoints > 0, 'INVALID MIN WINNER POINTS');

    modifier onlyOwnerOrNGO() {
        require(msg.sender == NGO || msg.sender == this.owner(), "PRODEX: NOT NGO OR CONTRACT OWNER");
        _;
    }

    modifier ableToClaim() {
        require(_eventIdProcessedCounter.current() == maxEvents, "PRODEX: ALL EVENTS MUST BE PROCESSED TO CLAIM PRIZE");
        _;
    }

    constructor(
        address _token,
        address _ngo,
        address _oracle,
        uint256 _ngoDonationPercentage,
        uint256 _maxEvents,
        uint256 _minWinnerPoints
    ) {
        require(_token != address(0), "INVALID TOKEN ADDRESS");
        require(_ngo != address(0), "INVALID NGO ADDRESS");
        require(_oracle != address(0), "INVALID ORACLE ADDRESS");
        require(_minWinnerPoints > 0, "INVALID MIN WINNER POINTS");

        maxEvents = _maxEvents;
        minWinnerPoints = _minWinnerPoints;
        token = _token;
        NGO = _ngo;
        NGODonationPercentage = _ngoDonationPercentage;
        oracle = _oracle;
        emit Initialized(token, NGO, oracle, NGODonationPercentage, maxEvents, minWinnerPoints);
    }

    /********** SETTERS ***********/
    function setMinWinnerPoints(uint256 _newMinWinnerPoints) external onlyOwner {
        require(_newMinWinnerPoints > 0, "INVALID MIN WINNER POINTS");
        uint256 oldMinnerPoints = _newMinWinnerPoints;
        minWinnerPoints = _newMinWinnerPoints;
        emit MinWinnerPointsUpdated(oldMinnerPoints, minWinnerPoints);
    }

    /********** GETTERS ***********/

  function validateEventCreation(Event memory _event) internal view {

    require(
      _event.blockInit > block.timestamp,
      'PRODEX: INIT BLOCK MUST BE GREATER THAN CURRENT BLOCK'
    );
    require(
      _event.blockEnd > block.timestamp,
      'PRODEX: END BLOCK MUST BE GREATER THAN CURRENT BLOCK'
    );
    require(
      _event.blockEnd >= _event.blockInit,
      'PRODEX: MATCH CANNOT END BEFORE MATCH INITIALIZATION'
    );
    require(_event.betTeamA.length == 0, 'PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION');
    require(_event.betTeamB.length == 0, 'PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION');
    require(_event.betDraw.length == 0, 'PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION');
  }

  function addEvent(Event memory _event) external onlyOwner returns (uint256) {
    uint256 currentEventId = _eventIdCounter.current();
    require(currentEventId <= maxEvents, 'PRODEX: CANNOT ADD MORE EVENTS');
    _eventIdCounter.increment();
    uint256 newEventId = _eventIdCounter.current();
    validateEventCreation(_event);
    _event.active = false;
    _event.poolSize = 0;
    _event.state = EventState.CREATED;
    events[newEventId] = _event;
    emit EventCreated(newEventId);
    return newEventId;
  }

    function validateEventCreation(Event memory _event) internal view {
        require(_event.blockInit > block.timestamp, "PRODEX: INIT BLOCK MUST BE GREATER THAN CURRENT BLOCK");
        require(_event.blockEnd > block.timestamp, "PRODEX: END BLOCK MUST BE GREATER THAN CURRENT BLOCK");
        require(_event.blockEnd >= _event.blockInit, "PRODEX: MATCH CANNOT END BEFORE MATCH INITIALIZATION");
        require(_event.betTeamA.length == 0, "PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION");
        require(_event.betTeamB.length == 0, "PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION");
        require(_event.betDraw.length == 0, "PRODEX: MATCH CANNOT HAVE BETS ON INITIALIZATION");
    }

  function startEvent(uint256 eventId) external validMaxEvents(eventId) {
    require(
      block.timestamp >= events[eventId].blockInit - events[eventId].thresholdInit,
      'PRODEX: CANNOT INIT EVENT YET'
    );
    events[eventId].active = true;
    events[eventId].state = EventState.ACTIVE;
    emit EventActive(eventId, events[eventId].blockInit, events[eventId].blockEnd);
  }

    /**TODO SATURDAY */
    function addEvents(Event[] memory _events) external onlyOwner {}

    function startEvent(uint256 eventId) external validEvent(eventId) {
        require(
            block.timestamp >= events[eventId].blockInit - events[eventId].thresholdInit,
            "PRODEX: CANNOT INIT EVENT YET"
        );
        events[eventId].active = true;
        events[eventId].state = EventState.ACTIVE;
        emit EventActive(eventId, events[eventId].blockInit, events[eventId].blockEnd);
    }

  function pokeOracle(uint256 eventId) external validEvent(eventId) {
    require(
      events[eventId].state == EventState.ORACLE,
      'PRODEX: EVENT STATE DOES NOT ALLOW TO POKE ORACLE'
    );
    require(
      block.timestamp > events[eventId].blockEnd + events[eventId].thresholdEnd,
      'PRODEX: IT IS NOT TIME TO POKE ORACLE YET'
    );
    uint8 eventResult = IOracle(oracle).getEventResult(eventId);

    events[eventId].eventOutcome = eventResult;
    events[eventId].state = EventState.UPDATING;
    emit EventOutcome(eventId, eventResult);
  }

    function pokeOracle(uint256 eventId) external validEvent(eventId) {
        require(events[eventId].state == EventState.ORACLE, "PRODEX: EVENT STATE DOES NOT ALLOW TO POKE ORACLE");
        require(
            block.timestamp > events[eventId].blockEnd + events[eventId].thresholdEnd,
            "PRODEX: IT IS NOT TIME TO POKE ORACLE YET"
        );
        uint8 eventResult = IOracle(oracle).getEventResult(eventId);
        events[eventId].eventOutcome = eventResult;
        events[eventId].state = EventState.UPDATING;
        emit EventOutcome(eventId, eventResult);
    }

    function getEventWinners(uint256 eventId) public view returns (address[] memory) {
        uint256 result = events[eventId].eventOutcome;
        if (result == 0) {
            return events[eventId].betTeamA;
        } else if (result == 1) {
            return events[eventId].betTeamB;
        } else {
            return events[eventId].betDraw;
        }
    }

  function placeBet(
    uint256 eventId,
    BetOdd bet,
    uint256 amount
  ) public validEvent(eventId) {
    require(events[eventId].active, 'PRODEX: EVENT NOT ACTIVE');
    require(block.timestamp <= events[eventId].blockInit, 'PRODEX: BET TIME EXPIRED');
    //TODO: it could bet better if this amount is a constant value
    require(amount > 0, 'PRODEX: AMOUNT TO BET MUST BE GREATER THAN ZERO');
    //TODO: This require is reverting the transaction with error :0x32 (Array accessed at an out-of-bounds or negative index)
    //TODO: I think we need to add the user to the mapping first. At the moment i will comment it
   /* require(
      usersByEvent[msg.sender][eventId] == 0,
      'PRODEX: USER CANNOT BET MORE THAN ONCE PER EVENT'
    );*/

    function placeBet(
        uint256 eventId,
        BetOdd bet,
        uint256 amount
    ) external validEvent(eventId) {
        require(events[eventId].active, "PRODEX: EVENT NOT ACTIVE");
        require(block.timestamp <= events[eventId].blockInit, "PRODEX: BET TIME EXPIRED");
        require(usersByEvent[msg.sender][eventId] == 0, "PRODEX: USER CANNOT BET MORE THAN ONCE PER EVENT");
        require(amount > 0, "PRODEX: AMOUNT TO BET MUST BE GREATER THAN ZERO");

        events[eventId].poolSize += amount;
        globalPoolSize += amount;
        if (bet == BetOdd.TEAM_A) {
            events[eventId].betTeamA.push(msg.sender);
        } else if (bet == BetOdd.TEAM_B) {
            events[eventId].betTeamB.push(msg.sender);
        } else {
            events[eventId].betDraw.push(msg.sender);
        }
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit BetPlaced(eventId, msg.sender, bet, amount);
    }

    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    emit BetPlaced(eventId, msg.sender, bet, amount);
  }

  function setPrizes() external {
    require(
      _eventIdProcessedCounter.current() == maxEvents,
      'PRODEX: ALL EVENTS MUST BE PROCESSED TO SET PRIZES'
    );
    require(winners > 0, 'PRODEX: NO WINNERS');
    uint256 percentage = 100 - NGODonationPercentage;
    uint256 usersTotalAmountToShare = globalPoolSize.mul(percentage).div(100);

    winnerPrize = usersTotalAmountToShare / winners;
    ngoPrize = globalPoolSize - usersTotalAmountToShare;
    emit PrizesSet(ngoPrize, winnerPrize, usersTotalAmountToShare, winners);
  }

  //TODO: why are we sending to address parameter, shouldn't be msg.sender?
  function claimPrize(address to) external ableToClaim {
    require(winnerPrize > 0, 'PRODEX: WINERPRIZE NOT SET');
    require(hitters[msg.sender] >= minWinnerPoints, 'PRODEX: USER NOT ELEGIBLE TO CLAIM PRIZE');
    IERC20(token).safeTransfer(to, winnerPrize);
    hitters[msg.sender] = 0;
    emit ClaimPrize(msg.sender, to);
  }

    function claimONG() external onlyOwnerOrNGO ableToClaim {
        IERC20(token).safeTransfer(NGO, ngoPrize);
        emit ClaimNGO(ngoPrize);
    }

    function isWinner(address user) external view returns (bool) {
        require(user != address(0), "PRODEX: INVALID ADDRESS");
        if (hitters[user] >= minWinnerPoints) {
            return true;
        }
        return false;
    }
}
