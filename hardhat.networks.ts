import '@nomiclabs/hardhat-etherscan'
import {NetworksUserConfig} from "hardhat/types";

const fs = require('fs')
let mnemonicLocal = ''
try {
    mnemonicLocal = fs.readFileSync('.secret').toString().trim()
} catch (error) {
    console.warn('no mnemonic file')
}

export const Networks: NetworksUserConfig = {
    hardhat: {
        blockGasLimit: 6800000,
        allowUnlimitedContractSize: true,
        chainId: 31337
    },
    ganache: {
        url: 'http://127.0.0.1:8545',
        blockGasLimit: 200000000,
        allowUnlimitedContractSize: false,
        chainId: 1337
    },
    bsctestnet: {
        url: 'https://data-seed-prebsc-1-s3.binance.org:8545',
        chainId: 97,
        gasPrice: 10000000000,
        accounts: {
            mnemonic: process.env.HDWALLET_MNEMONIC || mnemonicLocal
        }
    },
    bscmainnet: {
        chainId: 56,
        url: 'https://bsc-dataseed.binance.org/',
        accounts: {
            mnemonic: process.env.HDWALLET_MNEMONIC || mnemonicLocal
        },
        gas: 2100000,
        gasPrice: 8000000000
    },
    matistestnet:{
        chainId: 588,
        url: 'https://stardust.metis.io/?owner=588',
        gasPrice: 10000000000,
        accounts: {
            mnemonic: process.env.HDWALLET_MNEMONIC || mnemonicLocal
        }
    }
}
