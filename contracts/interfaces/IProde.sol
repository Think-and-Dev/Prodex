// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
   struct Bet {
        address user;          // who placed it
      //  bytes32 eventId;       // id of the sport event as registered in the Oracle
        // uint8   chosenWinner;  // Index of the team that will win according to the player
    }

    struct SportEvent | EventConfiguration {
        bytes32      id;
        string       name;
        uint8        participantCount;
        uint         date;
        EventOutcome outcome;
        uint8         winner;
       Bool isEnabled; 
       Uint256 thresholdInit
       Uint256 thresholdEnd
       Uint256 blockInit
       Uint256 blockEnd

—--
      Address[] betTeamA;
      Address[]  betTeamB
      Address[] betDraw;
—- 
    }
*/


interface IProde {

    enum EventState{
        CREATED,
        ACTIVE,
        UPDATING,
        FINISHED
    }

/*
    function changeStateEvent() external;
    function pokeOracle(uint256 eventId) external;
    function bet(uint256 eventId, Bet) external;
    function addEvent(Event memory _event) external onlyOwner returns(uint256);

    TODO SATURDAY 
    function addEvents(Event[] memory _events[])external;
    TODO

    function startEvent() external;
    function stopEventBetWindow() external;
    function finishEvent() external;
*/
}
