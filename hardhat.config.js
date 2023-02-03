require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const MUMBAI_ENDPOINT = process.env.MUMBAI_ENDPOINT;
const GOERLI_ENDPOINT = process.env.GOERLI_ENDPOINT;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

function accounts() {
  return { mnemonic: MNEMONIC };
}


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: MUMBAI_ENDPOINT,
      accounts: accounts()
    },
    goerli: {
      url: GOERLI_ENDPOINT,
      accounts: accounts()
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    }
  }
};
