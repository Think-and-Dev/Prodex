import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const {deployments, getNamedAccounts, network, getChainId} = hre
  const {deploy} = deployments
  const chainId = parseInt(await getChainId(), 10)
  const {deployer} = await getNamedAccounts()
  const oracle = await deployments.get('Oracle');

  const  MAX_EVENTS = 100;
  const  ONG_ADDRESS = "0x58eFdc4236465a87c996eb12751151a6084181f9";
  const  MIN_WINNER_POINTS = 100;
  const  DONATION_PERCENTAJE = 100;

  console.log('deployer', deployer)

  console.log(`\n Deploying Prodex...on chain ${chainId}`)

  let constructorArguments = [
    "0x",
    ONG_ADDRESS,
    oracle.address,
    DONATION_PERCENTAJE,
    MAX_EVENTS,
    MIN_WINNER_POINTS
]
  const deployResult = await deploy('Prodex', {
    from: deployer,
    args: constructorArguments,
    log: true
  })

  console.log(`\n Prodex deployed... ${deployResult.address}`)
}

func.dependencies = ["Oracle"]
func.tags = ['Prodex', '1.0.0']
func.id = 'Prodex'
export default func