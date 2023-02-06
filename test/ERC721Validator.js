const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const assert = require('assert');
const { utils } = require('ethers');


describe("ERC721Validator", function () {
  async function fixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const ERC721ValidatorFactory = await ethers.getContractFactory("ERC721ValidatorFactory");
    const erc721ValidatorFactory = await ERC721ValidatorFactory.deploy();
    await erc721ValidatorFactory.deployed();

    const ERC721Validator = await ethers.getContractFactory("ERC721Validator");
    const erc721Validator = await ERC721Validator.deploy(owner.address, "VID1");
    await erc721Validator.deployed();

    const NFT1 = await ethers.getContractFactory("Token");
    const nft1 = await NFT1.deploy("Token1", "TK1", user1.address);
    await nft1.deployed();

    const NFT2 = await ethers.getContractFactory("Token");
    const nft2 = await NFT2.deploy("Token2", "TK2", user1.address);
    await nft2.deployed();

    const NFT3 = await ethers.getContractFactory("Token");
    const nft3 = await NFT3.deploy("Token3", "TK3", user2.address);
    await nft3.deployed();

    return { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 };
  }

  it("Deploy test", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    assert(erc721ValidatorFactory);
    assert(erc721Validator);
    assert(nft1);
  });

  it("Add addresses test", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    await erc721Validator.registerNFT(nft1.address);
    await erc721Validator.registerNFT(nft2.address);
    await erc721Validator.registerNFT(nft3.address);
    let addresses = await erc721Validator.getNFTs();
    assert.equal(addresses.length, 3);
  });

  it("Add invalid addresses", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    let exception = false;
    try {
      await erc721Validator.registerNFT(erc721ValidatorFactory.address);
    } catch (error) {
      exception = true;
    }
    assert.equal(exception, true);
  });

  it("Remove address test", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    await erc721Validator.registerNFT(nft1.address);
    await erc721Validator.registerNFT(nft2.address);
    await erc721Validator.registerNFT(nft3.address);
    await erc721Validator.removeNFT(nft2.address);
    let addresses = await erc721Validator.getNFTs();
    assert.equal(!addresses.includes(nft2.address), true);
  });

  it("Deactivate test", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    await erc721Validator.registerNFT(nft1.address);
    await erc721Validator.registerNFT(nft2.address);
    await erc721Validator.deactivate();
    let error = false;
    try {
      await erc721Validator.registerNFT(nft3.address);
    }
    catch {
      error = true
    }
    assert.equal(error, true);
  });

  it("Validation test success", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    const userSessionKey = "usr20@"; // Generated from server
    const userSecret = "pwd12345" //generated from user 
    const abi = ethers.utils.defaultAbiCoder;
    const userSecretHashed = utils.keccak256(abi.encode(["string"], [userSecret]));
    await erc721Validator.registerNFT(nft1.address);
    await erc721Validator.registerNFT(nft3.address);
    await erc721Validator.connect(user2).setSecret(userSecretHashed);
    await erc721Validator.connect(user2).validate(userSessionKey);
    const blockNumber = await ethers.provider.getBlockNumber();
    const eventFilter = await erc721Validator.queryFilter('Validation', blockNumber - 10, blockNumber);
    let ev = eventFilter[0];
    const verificationHashControll = utils.keccak256(abi.encode(["string", "bytes32"], [userSessionKey, userSecretHashed]));
    assert.equal(ev.args.verificationHash, verificationHashControll);
    assert.equal(ev.args.result, true);
  });

  it("Validation test fail", async () => {
    const { erc721ValidatorFactory, erc721Validator, nft1, nft2, nft3, owner, user1, user2 } = await loadFixture(fixture);
    const userSessionKey = "usr20@"; // Generated from server
    const userSecret = "pwd12345" //generated from user 
    const abi = ethers.utils.defaultAbiCoder;
    const userSecretHashed = utils.keccak256(abi.encode(["string"], [userSecret]));
    await erc721Validator.registerNFT(nft3.address);
    await erc721Validator.connect(user1).setSecret(userSecretHashed);
    await erc721Validator.connect(user1).validate(userSessionKey);
    const blockNumber = await ethers.provider.getBlockNumber();
    const eventFilter = await erc721Validator.queryFilter('Validation', blockNumber - 10, blockNumber);
    let ev = eventFilter[0];
    const verificationHashControll = utils.keccak256(abi.encode(["string", "bytes32"], [userSessionKey, userSecretHashed]));
    assert.equal(ev.args.verificationHash, verificationHashControll);
    assert.equal(ev.args.result, false);
  });
});
