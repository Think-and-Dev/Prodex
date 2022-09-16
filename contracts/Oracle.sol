pragma solidity ^0.8.0;
import "./RNGInterface.sol";

contract Oracle {
    RNGInterface public _randomNumbers;
    constructor()  {
        address  randomService = 0x1cDC2A4fF8d374D91a1161C142cc496FBF5547Ec;
        _randomNumbers = RNGInterface(randomService);
    }

    function requestRandomNumber() external returns (uint32 requestId, uint32 lockBlock){
        return  _randomNumbers.requestRandomNumber();
    }

    function getEventResult(uint256 eventId) external returns (uint8) {
        //(uint32 requestId,)  = _randomNumbers.requestRandomNumber();
       // uint256 randomNumber = _randomNumbers.randomNumber(requestId);
       // uint256 result = randomNumber % 3;
        return 2;
    }

}
