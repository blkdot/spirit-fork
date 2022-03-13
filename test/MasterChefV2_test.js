const { expect } = require("chai");
const { expectRevert, time } = require('@openzeppelin/test-helpers');
const LqdrToken = artifacts.require('LqdrToken');
const MasterChef = artifacts.require('MasterChefV2');
const MockBEP20 = artifacts.require('libs/MockBEP20');
describe("MasterChefV2", () => {
  let provider;
  let signers, lqdr, lp1, lp2, lp3, lp4, owner, minter, fee, dev, alice, bob;
  beforeEach(async () => {
    // signers = await ethers.getSigners();
    // owner = signers[0].address;
    // minter = signers[1].address;
    // fee = signers[2].address;
    // dev = signers[3].address;
    // alice = signers[4].address;
    // bob = signers[5].address;

    // console.log(minter);
    // lqdr = await LqdrToken.new({ from: minter });
    // lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
    // lp2 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
    // lp3 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });

    // this.chef = await MasterChef.new(this.lqdr.address, dev, fee, '1000', '100', { from: minter });

    // await this.lqdr.transferOwnership(this.chef.address, { from: minter });

    // await lp1.transfer(bob, '2000', { from: minter });
    // await lp2.transfer(bob, '2000', { from: minter });
    // await lp3.transfer(bob, '2000', { from: minter });

    // await lp1.transfer(alice, '2000', { from: minter });
    // await lp2.transfer(alice, '2000', { from: minter });
    // await lp3.transfer(alice, '2000', { from: minter });
  });

  it("Should check the add token.", async function () {
    // this.lp4 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
    // this.lp5 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
    // this.lp6 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
    // this.lp7 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
    // this.lp8 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
    // this.lp9 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
    // console.log(lp1);
    // await this.chef.add(2000, lp1.address, 100, true, { from: minter });
    // await this.chef.add(1000, this.lp2.address, 100, true, { from: minter });
    // await this.chef.add(500, this.lp3.address, 100, true, { from: minter });
    // await this.chef.add(500, this.lp4.address, 100, true, { from: minter });
    // await this.chef.add(500, this.lp5.address, 100, true, { from: minter });
    // await this.chef.add(500, this.lp6.address, 100, true, { from: minter });
    // await this.chef.add(500, this.lp7.address, 100, true, { from: minter });
    // await this.chef.add(100, this.lp8.address, 100, true, { from: minter });
    // await this.chef.add(100, this.lp9.address, 100, true, { from: minter });
    // assert.equal((await this.chef.poolLength()).toString(), "10");

    // await time.advanceBlockTo('170');
    // await this.lp1.approve(this.chef.address, '1000', { from: alice });
    // assert.equal((await this.lqdr.balanceOf(alice)).toString(), '0');
    // await this.chef.deposit(1, '20', { from: alice });
    // await this.chef.withdraw(1, '20', { from: alice });
    // assert.equal((await this.lqdr.balanceOf(alice)).toString(), '263');

  });
});