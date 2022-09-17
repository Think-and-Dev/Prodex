import chai, {expect} from 'chai'
import hre, {ethers} from 'hardhat'

import {Prodex, MockToken} from '../typechain-types'
import {chaiEthers} from 'chai-ethers'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {createDefaultEvent, MINUTES} from './utils'
import {getCurrentTimestamp} from 'hardhat/internal/hardhat-network/provider/utils/getCurrentTimestamp'
import {BigNumber} from 'ethers'

chai.use(chaiEthers)

async function advanceBlock() {
  return ethers.provider.send('evm_mine', [])
}

describe('Prodex', () => {
  let deployer: SignerWithAddress
  let prodex: Prodex
  let mockERC20: MockToken

  beforeEach(async () => {
    await hre.network.provider.send('hardhat_reset')

    mockERC20 = await (
      await ethers.getContractFactory('MockToken')
    ).deploy('Theter', 'USDT', ethers.utils.parseEther('10000'))
    await mockERC20.deployed()

    const addresses = await ethers.getSigners()
    deployer = addresses[0]

    prodex = await (
      await ethers.getContractFactory('Prodex')
    ).deploy(mockERC20.address, deployer.address, deployer.address, 10, 10, 10)
    await prodex.deployed()
  })

  it('setMinWinnerPoints', async () => {
    await prodex.setMinWinnerPoints(500)
    const result = await prodex.minWinnerPoints()
    expect(result).to.be.equal(500)
  })

  it('addEvent', async () => {
    const event = createDefaultEvent()

    await expect(prodex.addEvent(event)).to.emit(prodex, 'EventCreated').withArgs(1)
    await expect(prodex.addEvent(event)).to.emit(prodex, 'EventCreated').withArgs(2)
  })

  it('startEvent', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES

    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, 'EventCreated').withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, 'EventActive')
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)
  })

  it('placeBet', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, 'EventCreated').withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, 'EventActive')
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    await prodex.placeBet(expectedEventId, 1, 10)
  })
})
