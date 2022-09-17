import {Signer, Wallet} from 'ethers'
import {ethers, getNamedAccounts} from 'hardhat'
import {Prodex} from '../typechain-types'

const startEvent = async (contract: Prodex, eventId: string) => {
  const tx = await contract.startEvent(eventId)
  const rc = await tx.wait()
  console.log('EVENT STARTED')
  console.log(rc)
}
const stopEventBetWindow = async (contract: Prodex, eventId: string) => {
  const tx = await contract.stopEventBetWindow(eventId)
  const rc = await tx.wait()
  console.log('EVENT BET STOPPED')
  console.log(rc)
}
const updateResults = async (contract: Prodex, eventId: string) => {
  const tx = await contract.updateResults(eventId)
  const rc = await tx.wait()
  console.log('EVENT UPDATED')
  console.log(rc)
}

const pokeOracle = async (contract: Prodex, eventId: string) => {
  const tx = await contract.pokeOracle(eventId)
  const rc = await tx.wait()
  console.log('ORACLE POKED')
  console.log(rc)
}

async function main() {
  const {deployer} = await getNamedAccounts()
  const signer = await ethers.getSigner(deployer)
  const Prodex = (await ethers.getContractAt('Prodex', process.env.PRODEX_ADDRESS as string, signer)) as Prodex
  switch (process.env.FUNCTION) {
    case 'startEvent':
      await startEvent(Prodex, process.env.EVENT_ID as string)
      break
    case 'stopEvent':
      await stopEventBetWindow(Prodex, process.env.EVENT_ID as string)
    case 'updateResults':
      await updateResults(Prodex, process.env.EVENT_ID as string)
    case 'pokeOracle':
      await pokeOracle(Prodex, process.env.EVENT_ID as string)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
