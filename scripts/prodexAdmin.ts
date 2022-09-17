import {Signer, Wallet} from 'ethers'
import {ethers, getNamedAccounts} from 'hardhat'
import {Prodex} from '../typechain-types'

async function main() {
  const {deployer} = await getNamedAccounts()
  const signer = await ethers.getSigner(deployer)
  const Prodex = (await ethers.getContractAt('Prodex', '0xf1038C1997372d9089CA83e0e253fAA3e3649C03', signer)) as Prodex

  const tx = await Prodex.addEvent({
    active: false,
    eventOutcome: '0',
    name: 'Partido 1',
    thresholdInit: '3000',
    thresholdEnd: '3000',
    blockInit: '5627554',
    blockEnd: '5927051',
    poolSize: '0',
    betTeamA: [],
    betTeamB: [],
    betDraw: [],
    state: '0'
  })
  console.log('MINTED')
  console.log(tx)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
