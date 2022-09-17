import chai, {expect} from 'chai'
import hre, {ethers} from 'hardhat'
import {Prodex, MockToken, Oracle} from '../typechain-types'
import {chaiEthers} from 'chai-ethers'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {AdvanceTimeForwardAndMine, BetOdd, createDefaultEvent, EVENTS, MINUTES} from './utils'
import {getCurrentTimestamp} from 'hardhat/internal/hardhat-network/provider/utils/getCurrentTimestamp'

chai.use(chaiEthers)

describe('Prodex', () => {
  let deployer: SignerWithAddress
  let prodex: Prodex
  let mockERC20: MockToken
  let sportOracle: Oracle
  let ngo: SignerWithAddress

  beforeEach(async () => {
    await hre.network.provider.send('hardhat_reset')

    mockERC20 = await (
      await ethers.getContractFactory('MockToken')
    ).deploy('Theter', 'USDT', ethers.utils.parseEther('10000'))
    await mockERC20.deployed()

    sportOracle = await (await ethers.getContractFactory('Oracle')).deploy()
    await sportOracle.deployed()

    const addresses = await ethers.getSigners()
    deployer = addresses[0]
    ngo = addresses[1]

    const ngoDonationPercentage = 15
    const maxEvents = 1
    const minWinnerPoints = 1

    prodex = await (
      await ethers.getContractFactory('Prodex')
    ).deploy(mockERC20.address, ngo.address, sportOracle.address, ngoDonationPercentage, maxEvents, minWinnerPoints)
    await prodex.deployed()
  })

  it('setMinWinnerPoints', async () => {
    await prodex.setMinWinnerPoints(500)
    const result = await prodex.minWinnerPoints()
    expect(result).to.be.equal(500)
  })

  it('addEvent', async () => {
    const event = createDefaultEvent()

    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(1)
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(2)
  })

  it('startEvent', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES

    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)
  })

  it('placeBet', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    await prodex.placeBet(expectedEventId, 1, 10)
  })

  it('stopEventBetWindow', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    const amountToBet = 10
    const betType = BetOdd.DRAW

    await expect(prodex.placeBet(expectedEventId, betType, amountToBet))
      .to.emit(prodex, EVENTS.BetPlaced)
      .withArgs(expectedEventId, deployer.address, betType, amountToBet)

    await AdvanceTimeForwardAndMine(50 * MINUTES)

    await expect(prodex.stopEventBetWindow(expectedEventId))
      .to.emit(prodex, EVENTS.EventBetsFinished)
      .withArgs(expectedEventId)
  })

  it('pokeOracle', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    const amountToBet = 10
    const betType = BetOdd.DRAW

    await expect(prodex.placeBet(expectedEventId, betType, amountToBet))
      .to.emit(prodex, EVENTS.BetPlaced)
      .withArgs(expectedEventId, deployer.address, betType, amountToBet)

    await AdvanceTimeForwardAndMine(50 * MINUTES)

    await expect(prodex.stopEventBetWindow(expectedEventId))
      .to.emit(prodex, EVENTS.EventBetsFinished)
      .withArgs(expectedEventId)

    await AdvanceTimeForwardAndMine(10 * MINUTES)

    await expect(prodex.pokeOracle(expectedEventId)).to.emit(prodex, EVENTS.EventOutcome).withArgs(expectedEventId, 2)
  })

  it('updateResult', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    const amountToBet = 10
    const betType = BetOdd.DRAW

    await expect(prodex.placeBet(expectedEventId, betType, amountToBet))
      .to.emit(prodex, EVENTS.BetPlaced)
      .withArgs(expectedEventId, deployer.address, betType, amountToBet)

    await AdvanceTimeForwardAndMine(50 * MINUTES)

    await expect(prodex.stopEventBetWindow(expectedEventId))
      .to.emit(prodex, EVENTS.EventBetsFinished)
      .withArgs(expectedEventId)

    await AdvanceTimeForwardAndMine(10 * MINUTES)

    await expect(prodex.pokeOracle(expectedEventId)).to.emit(prodex, EVENTS.EventOutcome).withArgs(expectedEventId, 2)

    await expect(prodex.updateResults(expectedEventId))
      .to.emit(prodex, EVENTS.UpdateWinnersEvent)
      .withArgs(expectedEventId, 1)
  })

  it('setPrizes', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    const amountToBet = 10
    const betType = BetOdd.DRAW

    await expect(prodex.placeBet(expectedEventId, betType, amountToBet))
      .to.emit(prodex, EVENTS.BetPlaced)
      .withArgs(expectedEventId, deployer.address, betType, amountToBet)

    await AdvanceTimeForwardAndMine(50 * MINUTES)

    await expect(prodex.stopEventBetWindow(expectedEventId))
      .to.emit(prodex, EVENTS.EventBetsFinished)
      .withArgs(expectedEventId)

    await AdvanceTimeForwardAndMine(10 * MINUTES)

    await expect(prodex.pokeOracle(expectedEventId)).to.emit(prodex, EVENTS.EventOutcome).withArgs(expectedEventId, 2)

    await expect(prodex.updateResults(expectedEventId))
      .to.emit(prodex, EVENTS.UpdateWinnersEvent)
      .withArgs(expectedEventId, 1)

    await expect(prodex.setPrizes()).to.emit(prodex, EVENTS.PrizesSet)
  })

  it('claimPrize', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    const amountToBet = 10
    const betType = BetOdd.DRAW

    await expect(prodex.placeBet(expectedEventId, betType, amountToBet))
      .to.emit(prodex, EVENTS.BetPlaced)
      .withArgs(expectedEventId, deployer.address, betType, amountToBet)

    await AdvanceTimeForwardAndMine(50 * MINUTES)

    await expect(prodex.stopEventBetWindow(expectedEventId))
      .to.emit(prodex, EVENTS.EventBetsFinished)
      .withArgs(expectedEventId)

    await AdvanceTimeForwardAndMine(10 * MINUTES)

    await expect(prodex.pokeOracle(expectedEventId)).to.emit(prodex, EVENTS.EventOutcome).withArgs(expectedEventId, 2)

    await expect(prodex.updateResults(expectedEventId))
      .to.emit(prodex, EVENTS.UpdateWinnersEvent)
      .withArgs(expectedEventId, 1)

    await expect(prodex.setPrizes()).to.emit(prodex, EVENTS.PrizesSet)

    await expect(prodex.claimPrize(deployer.address))
      .to.emit(prodex, EVENTS.ClaimPrize)
      .withArgs(deployer.address, deployer.address)
  })

  it('claimONG', async () => {
    const startTime = getCurrentTimestamp() + 5 * MINUTES
    const endTime = startTime + 45 * MINUTES
    //TODO: remember in the front end to approve
    await mockERC20.approve(prodex.address, ethers.constants.MaxUint256)
    const event = createDefaultEvent({blockInit: startTime, blockEnd: endTime})
    const expectedEventId = 1
    await expect(prodex.addEvent(event)).to.emit(prodex, EVENTS.EventCreated).withArgs(expectedEventId)

    await expect(prodex.startEvent(expectedEventId))
      .to.emit(prodex, EVENTS.EventActive)
      .withArgs(expectedEventId, event.blockInit, event.blockEnd)

    const amountToBet = 10
    const betType = BetOdd.DRAW

    await expect(prodex.placeBet(expectedEventId, betType, amountToBet))
      .to.emit(prodex, EVENTS.BetPlaced)
      .withArgs(expectedEventId, deployer.address, betType, amountToBet)

    await AdvanceTimeForwardAndMine(50 * MINUTES)

    await expect(prodex.stopEventBetWindow(expectedEventId))
      .to.emit(prodex, EVENTS.EventBetsFinished)
      .withArgs(expectedEventId)

    await AdvanceTimeForwardAndMine(10 * MINUTES)

    await expect(prodex.pokeOracle(expectedEventId)).to.emit(prodex, EVENTS.EventOutcome).withArgs(expectedEventId, 2)

    await expect(prodex.updateResults(expectedEventId))
      .to.emit(prodex, EVENTS.UpdateWinnersEvent)
      .withArgs(expectedEventId, 1)

    await expect(prodex.setPrizes()).to.emit(prodex, EVENTS.PrizesSet)

    await expect(prodex.connect(ngo).claimONG())
      .to.emit(prodex, EVENTS.ClaimNGO)
      .withArgs(await prodex.ngoPrize())
  })
})
