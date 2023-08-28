require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require("hardhat-jest-plugin");
require("hardhat-gas-reporter");

const { WALLET_PRIVATE_KEY } = process.env;
const { POLYGONSCAN_API_KEY } = process.env;
const { TESTNET_ALCHEMY_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "^0.8.0",
  networks: {
    // hardhat: {
    //   accounts: [{
    //     privateKey: WALLET_PRIVATE_KEY,
    //     balance: "10000000000000000000000" // 10,000 ETH, por exemplo
    //   }]
    // },
    mumbai: {
      url: TESTNET_ALCHEMY_URL,
      accounts: [`0x${WALLET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};