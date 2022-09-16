import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/dist/types'
import { verifyContracts } from "../utils/deploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const {deployments, getNamedAccounts, network, getChainId} = hre
  const {deploy} = deployments
  const chainId = parseInt(await getChainId(), 10)


  const {deployer} = await getNamedAccounts()

  console.log('deployer', deployer)

  console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('Contracts - Deploy Script')
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')


  let constructorArguments = ['0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB']

  const deployResult = await deploy('RNGChainlink', {
    from: deployer,
    args: constructorArguments,
    log: true
  })

  if (network.live) {
    await verifyContracts(hre, deployResult, constructorArguments)
  }
}

func.tags = ['RNGChainlink', '1.0.0']
func.id = 'RNGChainlink'
export default func
