const hre = require('hardhat')
const {ethers, deployments, getNamedAccounts} = hre

const getContract = async (contractName, address) => {
  const {deployer} = await getNamedAccounts()
  const Contract = await ethers.getContractAt(contractName, address, deployer)
  return Contract
}

const getCanisNFT = async (address) => getContract('CanisNFT', address)

module.exports = {
  getCanisNFT
}
