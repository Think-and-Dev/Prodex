import {Signer, Wallet} from 'ethers'
import {ethers, getNamedAccounts} from 'hardhat'
import {Prodex} from '../typechain-types'

async function main() {
  const {deployer} = await getNamedAccounts()
  const signer = await ethers.getSigner(deployer)
  const Prodex = (await ethers.getContractAt('Prodex', '0x9e77Ec5425D19F5DD49DD4C21357Bb0ffFb41218', signer)) as Prodex

  const tx = await Prodex.addEvent({
    active: false,
    eventOutcome: '0',
    name: 'Partido 1',
    thresholdInit: '3000',
    thresholdEnd: '0',
    blockInit: '5527890',
    blockEnd: '5527920',
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
