import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ProdeNFT } from "../typechain-types/contracts/ProdeNFT";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ProdeNFT", function () {

  const BASE_TOKEK_URI = "";
  const NAME = "";
  const SYMBOL = "";
  let prodeNFT: ProdeNFT;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    const ProdeNFT = await ethers.getContractFactory("ProdeNFT");
    prodeNFT = await ProdeNFT.deploy(BASE_TOKEK_URI, NAME, SYMBOL, "");
    [user1, user2] = await ethers.getSigners();
  });


  describe("Mint", function () {

    it("Balance of user", async function () {

      await prodeNFT.deployed();

      const user1_tx1 = await prodeNFT.connect(user1).safeMint(1);
      await user1_tx1.wait();

      const user2_tx1 = await prodeNFT.connect(user1).safeMint(2);
      await user2_tx1.wait();

      const balance = await prodeNFT.balanceOf(user1.address);

      expect(balance.toNumber()).to.equal(2);
    });

    it("Should revert because address had minted", async function () {

      await prodeNFT.deployed();

      const eventId = 1;

      await prodeNFT.safeMint(eventId)

      await expect(prodeNFT.safeMint(eventId)).to.be.revertedWith(
        "Ya obtuviste tu NFT para este evento"
      );
    });

  })
});