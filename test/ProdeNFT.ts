import {expect} from 'chai'
import {ethers,deployments} from 'hardhat'
import { Prodex } from "../typechain-types/contracts/Prodex";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ProdeNFT", function () {
  let prodex: Prodex;
  let owner: SignerWithAddress, deployer:SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;

  before(async()=>{
    const signers = await ethers.getSigners()
    const {deployer: dep} = await getNamedAccounts()
    deployer = await ethers.getSigner(dep)
    owner = signers[0]
    alice = signers[1]
  })

  beforeEach(async () => {
    await deployments.fixture();
    prodex = (await ethers.getContractAt('Prodex',deployer.address)) as Prodex;
  });

  describe("Prodex contract", function () {
    it('Initialized succesfully',async()=>{
      console.log('OK')
    })

    it('Should have initialized successfully',async()=>{

    });


  })
});