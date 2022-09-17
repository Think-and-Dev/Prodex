import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const {deployments, getNamedAccounts, network, getChainId} = hre
  const {deploy} = deployments
  const chainId = parseInt(await getChainId(), 10)
  const {deployer} = await getNamedAccounts()

  //const oracle = await deployments.get('Oracle')

  // const MockToken = await ethers.getContractFactory('MockToken')
  // const mockToken = await MockToken.deploy('TYD', 'TYD', 5000)
  // await mockToken.deployed()

  const MAX_EVENTS = 1
  const ONG_ADDRESS = '0x58eFdc4236465a87c996eb12751151a6084181f9'
  const MIN_WINNER_POINTS = 10
  const DONATION_PERCENTAJE = 100
  const BETAMOUNT = '1000000000000000000'

  console.log('deployer', deployer)

  console.log(`\n Deploying Prodex...on chain ${chainId}`)

  let constructorArguments = [
    '0x620183085B03064BE38529Df28Bf52ccF251f084',
    ONG_ADDRESS,
    '0x2e77379d26b40e70bae0EAB873E333cB79f28036',
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
