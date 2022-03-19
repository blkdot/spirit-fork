const { ethers } = require("hardhat");
const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { getBigNumber } = require("./utils");

const LqdrToken = artifacts.require('LqdrToken');
const MasterChef = artifacts.require('MasterChefV2');
const MockBEP20 = artifacts.require('libs/MockBEP20');

describe("Liquid Router", () => {
  const dai = "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E";//Dai Stablecoin
  const usdc = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";//ACF Andre Cronje Fantom
  let provider, router, factory, erc20;
  let chef, lqdr;

  let LiquidRouter, signers, whaleSigner, owner, whale, minter, fee, dev, alice, bob;
  let tokenUsdc, tokenDai;
  let addLiquidityResult;
  beforeEach(async () => {
    signers = await ethers.getSigners();
    [owner] = await ethers.getSigners();
    whale = signers[1].address;
    minter = signers[1].address;
    dev = signers[3].address;
    fee = signers[4].address;
    alice = signers[5].address;
    bob = signers[6].address;

    provider = ethers.getDefaultProvider();

    LiquidRouter = await ethers.getContractFactory("LiquidRouter", signers[1]);
    router = await LiquidRouter.deploy();
    await router.deployed();
    
    erc20 = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      ethers.constants.AddressZero
    );

    lqdr = await LqdrToken.new({ from: minter });
    chef = await MasterChef.new(lqdr.address, dev, fee, '1000', '100', { from: minter });
    await lqdr.transferOwnership(chef.address, { from: minter });  
  });

  it("Should check the addliquidity and create LP token.", async function () {
    
    const to = "0xAdf9319359718fa2320Af2CA96d7Fc024329c928";
    const spirit = "0x5Cc61A78F164885776AA610fb0FE1257df78E59B";//Spirit
    const mim = "0x82f0B8B456c1A451378467398982d4834b6829c1";//Magic Internet Money
    const lqdr = "0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9";//LQDR token
    const frax = "0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355";//FRAX token

    await hre.network.provider.send("hardhat_impersonateAccount", [whale]);
    whaleSigner = await ethers.provider.getSigner(whale);

    tokenDai = await erc20.attach(dai);
    tokenUsdc = await erc20.attach(usdc);
    const tokenMim = await erc20.attach(mim);
    const tokenSpirit = await erc20.attach(spirit);
    const tokenLqdr = await erc20.attach(lqdr);
    const tokenFrax = await erc20.attach(frax);

    let fweth = await router.connect(whaleSigner).getWETH();
    console.log(fweth);
    let ether_amount = 5;

    let amountADesired = await router.connect(whaleSigner).getAmountsOut(getBigNumber(ether_amount, 18), [fweth, tokenDai.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountADesired[1],
      [fweth, tokenDai.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(ether_amount, 18)
      }
    );
    let bal_dai = await tokenDai.balanceOf(whale);
    console.log("DAI token's balance:", await tokenDai.balanceOf(whale));

    let amountBDesired = await router.connect(whaleSigner).getAmountsOut(getBigNumber(ether_amount, 18), [fweth, tokenMim.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountBDesired[1],
      [fweth, tokenMim.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(ether_amount, 18)
      }
    );
    console.log("MIM token's balance:", await tokenMim.balanceOf(whale));

    let amountCDesired = await router.connect(whaleSigner).getAmountsOut(getBigNumber(ether_amount, 18), [fweth, tokenSpirit.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountCDesired[1],
      [fweth, tokenSpirit.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(ether_amount, 18)
      }
    );
    console.log("SPIRIT token's balance:", await tokenSpirit.balanceOf(whale));

    let amountDDesired = await router.connect(whaleSigner).getAmountsOut(getBigNumber(ether_amount, 18), [fweth, tokenLqdr.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountDDesired[1],
      [fweth, tokenLqdr.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(2 * ether_amount, 18)
      }
    );
    console.log("LQDR token's balance:", await tokenLqdr.balanceOf(whale));

    let amountEDesired = await router.connect(whaleSigner).getAmountsOut(getBigNumber(ether_amount, 18), [fweth, tokenUsdc.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountEDesired[1],
      [fweth, tokenUsdc.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(ether_amount, 18)
      }
    );
    let bal_usdc = await tokenUsdc.balanceOf(whale);
    console.log("USDC token's balance:", await tokenUsdc.balanceOf(whale));
    
    let amountFDesired = await router.connect(whaleSigner).getAmountsOut(getBigNumber(ether_amount, 18), [fweth, tokenFrax.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountFDesired[1],
      [fweth, tokenFrax.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(ether_amount, 18)
      }
    );
    console.log("Frax token's balance:", await tokenUsdc.balanceOf(whale));

    // let resultALE = await router.connect(whaleSigner).addLiquidityETH(
    //   lqdr,
    //   getBigNumber(2, 18),
    //   1000,
    //   1,
    //   whale,
    //   Date.now() + 60 * 60,
    //   {
    //     value: getBigNumber(2, 18)
    //   }
    // );
    // console.log("ADDLIQUIDITYETH Result:", resultALE);
    
    
    let amounts = await router.connect(whaleSigner).getAmount(usdc, dai, bal_usdc, bal_dai, 1, 1);
    console.log(amounts['amountA']);
    await tokenUsdc.connect(whaleSigner).approve(router.address, amounts['amountA']);
    await tokenDai.connect(whaleSigner).approve(router.address, amounts['amountB']);
    await router.connect(whaleSigner).safeTransfer(usdc, amounts['amountA']);
    await router.connect(whaleSigner).safeTransfer(dai, amounts['amountB']);
    addLiquidityResult = await router.connect(whaleSigner).addLiquidity(
      usdc,
      dai,
      amounts['amountA'],
      amounts['amountB'],
      1,
      1,
      whale,
      Date.now() + 60 * 60
    );
    //console.log("ADDLIQUIDITY Result:", addLiquidityResult);
    
  });
  it("Should add the created LP in the MasterChef pool", async function () {
    await hre.network.provider.send("hardhat_impersonateAccount", [whale]);
    whaleSigner = await ethers.provider.getSigner(whale);
    let pairAddr = await router.connect(whaleSigner).getPair(usdc, dai);
    let lpToken = await erc20.attach(pairAddr);
    console.log("SPIRIT LP(USDC/DAI) token's balance:", await lpToken.balanceOf(whale));
    let bal = await lpToken.balanceOf(whale);
    
    await chef.add(parseInt(bal * 0.1), lpToken.address, 100, true, { from: whale });
    assert.equal((await chef.poolLength()).toString(), "1");
    
  });

  it("Should deposit and withdraw the created LP in the correct Farm", async function () {
    await hre.network.provider.send("hardhat_impersonateAccount", [whale]);
    whaleSigner = await ethers.provider.getSigner(whale);
    let pairAddr = await router.connect(whaleSigner).getPair(usdc, dai);
    let lpToken = await erc20.attach(pairAddr);
    let bal = await lpToken.balanceOf(whale);
    console.log("SPIRIT LP(USDC/DAI) token's balance:", bal);
    console.log(await router.connect(whaleSigner).getPairTokens(pairAddr));

    await chef.add(parseInt(bal * 0.1), lpToken.address, 100, true, { from: whale });
    assert.equal((await chef.poolLength()).toString(), "1");

    await lpToken.connect(whaleSigner).approve(alice, 100);
    await lpToken.connect(whaleSigner).transfer(alice, 100);
    console.log("Alice's LP Token Amount: ", (await lpToken.balanceOf(alice)).toString());

    await hre.network.provider.send("hardhat_impersonateAccount", [alice]);
    let aliceSigner = await ethers.provider.getSigner(alice);
    
    let aliceBalanceBeforeDeposit = await lpToken.connect(aliceSigner).balanceOf(alice);
    await lpToken.connect(aliceSigner).approve(chef.address, 100);
    await chef.deposit(0, 20, { from: alice });
    await chef.deposit(0, 40, { from: alice });
    let aliceBalanceAfterDeposit = await lpToken.connect(aliceSigner).balanceOf(alice);
    assert.equal((aliceBalanceBeforeDeposit - aliceBalanceAfterDeposit).toString(), '60');
    let userPoolInfo = await chef.getUserPoolInfo(alice);
    assert.equal(userPoolInfo[1].toString(), '60');
    
    await chef.withdraw(0, '10', { from: alice });
    let aliceBalanceAfterWithdraw = await lpToken.connect(aliceSigner).balanceOf(alice);
    assert.equal((aliceBalanceBeforeDeposit - aliceBalanceAfterWithdraw).toString(), '50');
    
  });

});
