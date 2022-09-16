import chai, {expect} from 'chai'
import hre, {ethers} from 'hardhat'

import { Prodex, Oracle} from '../typechain'
import {chaiEthers} from 'chai-ethers'
import {  SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


chai.use(chaiEthers)

async function advanceBlock() {
  return ethers.provider.send('evm_mine', []);
}

describe('Prodex', () => {
  let deployer: SignerWithAddress
  let oracle: Oracle
  let prodex: Prodex

  beforeEach(async () => {
    const addresses = await ethers.getSigners()
    deployer = addresses[0]

    prodex = await (await ethers.getContractFactory('Prodex')).deploy(deployer.address, deployer.address, deployer.address, 10, 10, 10)
    await prodex.deployed()
  })

  it('setMinWinnerPoints', async () => {
   await prodex.setMinWinnerPoints(500)
    const result = await prodex.minWinnerPoints()
    expect(result).to.be.equal(500)
  })


  it('addEvent', async () => {

    const event =  {
        active: true,
        eventOutcome: 2,
        name :  'WorldCup',
        thresholdInit : 500 ,
        thresholdEnd : 500,
        blockInit : 1694903187,
        blockEnd: 1694909187,
        poolSize : 500,
        betTeamA : [],
        betTeamB : [],
        betDraw : [],
        state :0
    }

    await expect( prodex.addEvent(event)).to.emit(prodex, 'EventCreated').withArgs(1)

  })


})
