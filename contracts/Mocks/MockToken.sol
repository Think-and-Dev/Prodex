// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

contract MockToken is ERC20Burnable {
  constructor(
    string memory name,
    string memory symbol,
    uint256 supply
  ) ERC20(name, symbol) {
    _mint(msg.sender, supply);
  }
}
