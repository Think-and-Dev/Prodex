// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Prodex.sol";

contract ProdeNFT is ERC721URIStorage, Ownable {

    string public baseTokenUri;
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;

    string public contractUri;
    address public betContractAddress;

    event Initialized(string tokenUri, string name, string symbol);
    event ContractURIUpdated(string indexed contractUri);

    mapping(uint256 => mapping(address => bool)) mints;

    constructor(
        string memory _baseTokenUri,
        string memory _name,
        string memory _symbol,
        address _betContractAddress
    ) ERC721(_name, _symbol) {
        baseTokenUri = _baseTokenUri;
        betContractAddress = _betContractAddress;
        emit Initialized(_baseTokenUri, _name, _symbol);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenUri;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(uint256 _eventId) external returns (uint256) {
        
        require(mints[_eventId][msg.sender] == false, "Ya obtuviste tu NFT para este evento");
        require(checkIfIsWinner(msg.sender), "No ganaste el evento");

        tokenIdCounter.increment();
        uint256 newTokenId = tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);

        mints[_eventId][msg.sender] = true;
        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function contractURI() public view returns (string memory) {
        return contractUri;
    }

    function setContractURI(string memory uri) public {
        contractUri = uri;
        emit ContractURIUpdated(contractUri);
    }

    function checkIfIsWinner(address minterAddress) private returns(bool){
        Prodex prodexContract = Prodex(betContractAddress);
        return prodexContract.isWinner(minterAddress);
    }
}
