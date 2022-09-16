/* eslint-disable node/no-unpublished-import */
import '@nomicfoundation/hardhat-toolbox';
import {Networks} from './hardhat.networks'
import {NamedAccounts} from './hardhat.accounts'
import {HardhatUserConfig} from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: Networks,
  namedAccounts: NamedAccounts,
  etherscan: {
    apiKey: {
      //@ts-ignore
      bscTestnet: process.env.ETHERSCAN_BSC_API_KEY
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: {
    sources: 'contracts'
  },
  gasReporter: {
    currency: 'USD',
    token: 'BNB',
    gasPriceApi: 'https://api.bscscan.com/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: process.env.CMC_API_KEY,
    enabled: !!process.env.REPORT_GAS
  },
  mocha: {
    timeout: 60000
  },
  abiExporter: {
    path: './abis',
    runOnCompile: false,
    clear: true,
    flat: true
  }
}
export default config
