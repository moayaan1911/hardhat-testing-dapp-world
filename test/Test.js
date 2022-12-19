const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
describe("ValueContract", () => {
  async function deployFunction() {
    // we will call this function in our tests to deploy a new contract and add an owner
    let contractFactory = await ethers.getContractFactory("ValueContract");
    let contract = await contractFactory.deploy(100);
    // (await contract).deployed();
    const [owner, otherAccount] = await ethers.getSigners();
    return { contract, owner, otherAccount };
  }

  it("should add value to balance", async () => {
    const { contract } = await loadFixture(deployFunction);
    await contract.add(50);
    const balance = await contract.balance();
    expect(balance.toNumber()).to.equal(150);
  });

  it("should subtract value from balance", async () => {
    const { contract, owner } = await loadFixture(deployFunction);
    await contract.subtract(25, { from: owner.address });
    const balance = await contract.balance();
    expect(balance.toNumber()).to.equal(75);
  });

  it("should not allow non-owners to subtract value from balance", async () => {
    const { contract, otherAccount } = await loadFixture(deployFunction);
    await expect(
      contract.connect(otherAccount).subtract(25)
    ).to.be.rejectedWith("You are not the owner");
  });

  it("should emit ADDVALUE event", async () => {
    const { contract, owner } = await deployFunction();
    await contract.add(50);
    const balance = await contract.balance();
    expect(balance.toNumber()).to.emit(50, balance, "ADDVALUE");
  });
  it("should emit SUBVALUE event", async () => {
    const { contract, owner } = await deployFunction();
    await contract.subtract(25, { from: owner.address });
    const balance = await contract.balance();
    expect(balance.toNumber()).to.emit(25, balance, "SUBVALUE");
  });
  it("should return the owner", async () => {
    const { contract, owner } = await deployFunction();

    expect(await contract.getOwner()).to.equal(owner.address);
  });
  deployFunction();
});
