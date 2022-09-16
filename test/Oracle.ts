import chai, {expect} from 'chai'
import hre, {ethers} from 'hardhat'

import { RNGBlockhash, Oracle} from '../typechain'
import {chaiEthers} from 'chai-ethers'
import {  SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


chai.use(chaiEthers)

async function advanceBlock() {
  return ethers.provider.send('evm_mine', []);
}

describe('Random Number Generator', () => {
  let deployer: SignerWithAddress
  let oracle: Oracle
  let rNGBlockhash: RNGBlockhash

  beforeEach(async () => {
    const addresses = await ethers.getSigners()
    deployer = addresses[0]

    rNGBlockhash = await (await ethers.getContractFactory('RNGBlockhash')).deploy()
    await rNGBlockhash.deployed()

    oracle = await (await ethers.getContractFactory('Oracle')).deploy(rNGBlockhash.address)
    await oracle.deployed()

  })

  it('random number generator', async () => {
    const request = await rNGBlockhash.requestRandomNumber()
    console.log( request.value)

    await advanceBlock()

    const request2 = await rNGBlockhash.requestRandomNumber()
    console.log( request2.value)
    //const num = await rNGBlockhash.randomNumber(request.value)
  })
})
