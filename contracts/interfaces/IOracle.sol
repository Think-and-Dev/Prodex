// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOracle {
  function getEventResult(uint256 eventId) external returns (uint8);
}
