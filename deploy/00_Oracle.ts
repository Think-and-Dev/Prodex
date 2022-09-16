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

  console.log(`\n Deploying Lock...on ${chainName}-${chainId}`)

  const unlockDate = 1694795386
  let constructorArguments = [unlockDate]

  const deployResult = await deploy('Lock', {
    from: deployer,
    args: constructorArguments,
    log: true
  })
}

func.tags = ['Oracle', '1.0.0']
func.id = 'Oracle'
export default func
