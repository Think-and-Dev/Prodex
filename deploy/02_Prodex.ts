import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const {deployments, getNamedAccounts, network, getChainId} = hre
  const {deploy} = deployments
  const chainId = parseInt(await getChainId(), 10)
  const {deployer} = await getNamedAccounts()

  const oracle = await deployments.get('Oracle')

  const MockToken = await ethers.getContractFactory('MockToken')
  const mockToken = await MockToken.deploy('TYD', 'TYD', 5000)
  await mockToken.deployed()

  const MAX_EVENTS = 100
  const ONG_ADDRESS = '0x58eFdc4236465a87c996eb12751151a6084181f9'
  const MIN_WINNER_POINTS = 10
  const DONATION_PERCENTAJE = 100
  const BETAMOUNT = 1000

  console.log('deployer', deployer)

  console.log(`\n Deploying Prodex...on chain ${chainId}`)

  let constructorArguments = [
    mockToken.address,
    ONG_ADDRESS,
    oracle.address,
    DONATION_PERCENTAJE,
    MAX_EVENTS,
    MIN_WINNER_POINTS,
    BETAMOUNT
  ]

  console.log('constructorArguments', constructorArguments)

  const deployResult = await deploy('Prodex', {
    from: deployer,
    args: constructorArguments,
    log: true
  })

  console.log(`\n Prodex deployed... ${deployResult.address}`)
}

func.tags = ['Prodex', '1.0.0']
func.id = 'Prodex'
export default func
