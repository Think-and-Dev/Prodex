import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    //@ts-ignore
    const { deployments, getNamedAccounts, network, getChainId } = hre
    const { deploy } = deployments
    const chainId = parseInt(await getChainId(), 10)
    const { deployer } = await getNamedAccounts()
    const prodex = await deployments.get('Prodex');

    console.log('deployer', deployer)

    console.log(`\n Deploying ProdeNFT...on chain ${chainId}`)

    let constructorArguments = ["","ThinkAndDev","T&D", prodex.address]

    const deployResult = await deploy('ProdeNFT', {
        from: deployer,
        args: constructorArguments,
        log: true
    })

    console.log(`\n ProdeNFT deployed... ${deployResult.address}`)
}

func.dependencies = ["Prodex"]
func.tags = ['ProdeNFT', '1.0.0']
func.id = 'ProdeNFT'
export default func
