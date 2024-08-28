require("dotenv").config();
//usePlugin("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-spdx-license-identifier");
require("@openzeppelin/hardhat-upgrades");

const DEFAULT_MNEMONIC =
  "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      blockGasLimit: 12500000,
      allowUnlimitedContractSize: true,
    },
    reporter: {
      gas: 5000000,
      url: "http://localhost:8545",
    },
    coverage: {
      url: "http://localhost:8555",
    },
    titan_sepolia: {
      url: `https://rpc.titan-sepolia.tokamak.network`,
      accounts: {
        mnemonic: process.env.MNEMONIC || DEFAULT_MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
    bsc_testnet: {
      url: `https://bsc-testnet.core.chainstack.com/0b64d77a9230f4c28ada3aa4966f41c7/`,
      accounts: {
        mnemonic: process.env.MNEMONIC || DEFAULT_MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  etherscan: {
    apiKey: {
      titan_sepolia: "abcd",
      bscTestnet: "abcd",
    },
    customChains: [
      {
        network: "titan_sepolia",
        chainId: 55007,
        urls: {
            apiURL: "https://explorer.titan-sepolia.tokamak.network/api",
            browserURL: "https://explorer.titan-sepolia.tokamak.network/",
        },
    }
    ]
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true, // Default: false
        runs: 200, // Default: 200
      },
    }
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [
      "ERC20Mock",
      "PayableRevert",
      "ERC777Mock",
      "ERC20MockFake",
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
};