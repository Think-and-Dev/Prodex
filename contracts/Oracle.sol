pragma solidity ^0.8.0;
import "./interfaces/IRNG.sol";
import "hardhat/console.sol";

contract Oracle {
    IRNG public _randomNumbers;
    event RequestedRandomId(uint256 eventId, uint32 requestedId);
    mapping(uint256 => uint32) public requested;

    constructor(address randomServiceAddress) {
        _randomNumbers = IRNG(randomServiceAddress);
    }

    function requestRandomNumber(uint256 eventId) external {
        (uint32 requestedId , )= _randomNumbers.requestRandomNumber();
        requested[eventId] = requestedId;
        emit RequestedRandomId(eventId, requestedId);
    }

    function isRequestComplete(uint32 requestId) external view  returns (bool isCompleted) {
        return _randomNumbers.isRequestComplete(requestId);
    }

    function getEventResult(uint256 eventId) external returns (uint256) {
        uint32  requestedId = requested[eventId];
        //require(requestedId > 0 , "SHOULD REQUEST A RANDOM ID FIRST");
        //require(_randomNumbers.isRequestComplete(requestedId), "NOT GENERATED YET");
        //uint256 result =  _randomNumbers.randomNumber(requestedId);
        return 2;
    }

    function getResult(uint256 eventId) external view returns (uint256) {
        uint32  requestedId = requested[eventId];
        uint256 random  =_randomNumbers.getRandomNumber(requestedId);
        return random % 3;
    }
}
