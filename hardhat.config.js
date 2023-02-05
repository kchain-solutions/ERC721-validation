require("@nomicfoundation/hardhat-toolbox");
const { utils } = require('ethers');
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const MUMBAI_ENDPOINT = process.env.MUMBAI_ENDPOINT;
const GOERLI_ENDPOINT = process.env.GOERLI_ENDPOINT;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

function accounts() {
  return { mnemonic: MNEMONIC };
}

task("hashSecret", "Keccak256 hash from string")
  .addParam("secret", "user secret string")
  .setAction((taskArgs) => {
    const abi = ethers.utils.defaultAbiCoder;
    const secretHashed = utils.keccak256(abi.encode(["string"], [taskArgs.secret]));
    console.log(secretHashed);
  });

task("checkHash", "Keccak256 hash from string")
  .addParam("secret", "user secret string")
  .addParam("userSessionKey", "userSessionKey")
  .setAction((taskArgs) => {
    const abi = ethers.utils.defaultAbiCoder;
    const secretHashed = utils.keccak256(abi.encode(["string"], [taskArgs.secret]));
    const verificationHashControll = utils.keccak256(abi.encode(["string", "bytes32"], [taskArgs.userSessionKey, secretHashed]));
    console.log(verificationHashControll);
  });

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
