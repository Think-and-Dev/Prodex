const hre = require('hardhat')
const {ethers, deployments, getNamedAccounts} = hre

const getContract = async (contractName, address) => {
  const {deployer} = await getNamedAccounts()
  const Contract = await ethers.getContractAt(contractName, address, deployer)
  return Contract
}

const getProdex = async (address:string) => getContract('Prodex', address)
const getOracle = async (address:string) => getContract('Oracle', address)
const getNFT = async(address: string) => getContract('ProdeNFT',address)

module.exports = {
  getProdex,
  getOracle,
  getNFT
}
