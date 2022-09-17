import {Prodex} from '../typechain-types'
import {network} from 'hardhat'

export const createDefaultEvent = (params?: Partial<Prodex.EventStruct>) => {
  const event: Prodex.EventStruct = {
    active: true,
    eventOutcome: 2,
    name: params?.name || 'World Cup',
    thresholdInit: params?.thresholdInit || 500,
    thresholdEnd: params?.thresholdEnd || 500,
    blockInit: params?.blockInit || 1694903187,
    blockEnd: params?.blockEnd || 1694909187,
    poolSize: params?.poolSize || 500,
    betTeamA: [],
    betTeamB: [],
    betDraw: [],
    state: 0
  }

  return event
}

export const AdvanceTimeForwardAndMine = async (time: number) => {
  await network.provider.send('evm_increaseTime', [time])
  await network.provider.send('evm_mine')
}

export const MINUTES = 60
export const HOURS = 60 * MINUTES
export const DAYS = 24 * HOURS
