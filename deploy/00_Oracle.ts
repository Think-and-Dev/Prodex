import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const { deployments, getNamedAccounts, network, getChainId } = hre
  const { deploy } = deployments
  const chainId = parseInt(await getChainId(), 10)

  const { deployer } = await getNamedAccounts()

  console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('Contracts - Deploy Script')
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')



  console.log(`\n Deploying Oracle...on ${chainId}`)

  const deployResult = await deploy('Oracle', {
    from: deployer,
    log: true
  })

  console.log(`\n Oracle deployed... ${deployResult.address}`)
}

func.tags = ['Oracle', '1.0.0']
func.id = 'Oracle'
export default func
