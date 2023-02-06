require("@nomicfoundation/hardhat-toolbox");
const { utils } = require('ethers');
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const GOERLI_ENDPOINT = process.env.GOERLI_ENDPOINT;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

function accounts() {
  return { mnemonic: MNEMONIC };
}

task("hashingSecret", "Keccak256 hash from string")
  .addParam("secret", "user secret string")
  .setAction((taskArgs) => {
    const abi = ethers.utils.defaultAbiCoder;
    const secretHashed = utils.keccak256(abi.encode(["string"], [taskArgs.secret]));
    console.log(secretHashed);
  });

task("controlHash", "Keccak256 hash from string")
  .addParam("hash", "hash string to check")
  .addParam("secret", "user secret string")
  .addParam("userSessionKey", "userSessionKey")
  .setAction((taskArgs) => {
    const abi = ethers.utils.defaultAbiCoder;
    const secretHashed = utils.keccak256(abi.encode(["string"], [taskArgs.secret]));
    const verificationHashControll = utils.keccak256(abi.encode(["string", "bytes32"], [taskArgs.userSessionKey, secretHashed]));
    const comparison = verificationHashControll === taskArgs.hash;
    console.log(`Hash to check: ${taskArgs.hash} - hash calculated: ${verificationHashControll}`);
    console.log('Result: ', comparison);
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
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
