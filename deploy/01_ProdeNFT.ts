import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const {deployments, getNamedAccounts, network, getChainId} = hre
  const {deploy} = deployments
  const chainId = parseInt(await getChainId(), 10)
  const chainName ='BSC'

  const {deployer} = await getNamedAccounts()

  console.log('deployer', deployer)

  console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('Contracts - Deploy Script')
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  console.log(`\n Deploying ProdeNFT...on ${chainName}-${chainId}`)

  let constructorArguments = ["","ThinkAndDev","T&D", "0x58eFdc4236465a87c996eb12751151a6084181f9"]

  const deployResult = await deploy('ProdeNFT', {
    from: deployer,
    args: constructorArguments,
    log: true
  })
}

func.tags = ['ProdeNFT', '1.0.0']
func.id = 'ProdeNFT'
export default func
