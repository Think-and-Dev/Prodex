import chai, {expect} from 'chai'
import hre, {ethers} from 'hardhat'

import { RNGBlockhash, Oracle} from '../typechain'
import {chaiEthers} from 'chai-ethers'
import {  SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


chai.use(chaiEthers)

async function advanceBlock() {
  return ethers.provider.send('evm_mine', []);
}

async function advanceBlockTo(blockNumber) {
    for (let i = await ethers.provider.getBlockNumber(); i < blockNumber; i++) {
      await advanceBlock();
    }
}

describe('Random Number Generator', () => {
  let deployer: SignerWithAddress
  let oracle: Oracle
  let rNGBlockhash: RNGBlockhash

  beforeEach(async () => {
    const addresses = await ethers.getSigners()
    deployer = addresses[0]

    const RNGBlockchash = await ethers.getContractFactory('RNGBlockhash')
    rNGBlockhash = await RNGBlockchash.deploy()
    await rNGBlockhash.deployed()
  })

  it('Random number generator', async () => {
    const tx = await rNGBlockhash.requestRandomNumber()
    const rc = await tx.wait();

    const event = rc.events.find(event => event.event == 'RandomNumberRequested');
    const [requestId,sender] = event.args;
    console.log(requestId,sender);
  })

  it('Complete flow',async()=>{
    const tx = await rNGBlockhash.requestRandomNumber()
    const rc = await tx.wait();

    const event = rc.events.find(event => event.event == 'RandomNumberRequested');
    const [requestId,sender] = event.args;
    console.log(requestId,sender);

    await advanceBlockTo(await ethers.provider.getBlockNumber()+20);
    const complet = await rNGBlockhash.isRequestComplete(requestId);
    expect(complet).to.be.true

    const tx2 = await rNGBlockhash.randomNumber(requestId)
    const rc2 = await tx2.wait();
    const event2 = rc2.events.find(event2 => event2.event == 'RandomNumberGetted');
    const [number] = event2.args;
    console.log((number % 3).toString());
  })

})
