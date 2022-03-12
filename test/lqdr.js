const { ethers } = require("hardhat");
const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { getBigNumber } = require("./utils");

describe("Liquid Router", () => {
  let provider;
  let LiquidRouter, signers, owner, router, factory, erc20;
  beforeEach(async () => {
    signers = await ethers.getSigners();
    [owner] = await ethers.getSigners();
    provider = ethers.getDefaultProvider();

    LiquidRouter = await ethers.getContractFactory("LiquidRouter");
    router = await LiquidRouter.deploy();
    await router.deployed();
    
    erc20 = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      ethers.constants.AddressZero
    );
    
  });

  it("Should check the addliquidity.", async function () {
    const whale = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";//account 1
    const to = "0xAdf9319359718fa2320Af2CA96d7Fc024329c928";

    const dai = "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E";//Dai Stablecoin
    const usdc = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";//ACF Andre Cronje Fantom
    const spirit = "0x5Cc61A78F164885776AA610fb0FE1257df78E59B";//Spirit
    const mim = "0x82f0B8B456c1A451378467398982d4834b6829c1";//Magic Internet Money
    const lqdr = "0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9";//LQDR token
    const frax = "0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355";//FRAX token

    await hre.network.provider.send("hardhat_impersonateAccount", [whale]);
    const whaleSigner = await ethers.provider.getSigner(whale);

    const tokenDai = await erc20.attach(dai);
    const tokenMim = await erc20.attach(mim);
    const tokenSpirit = await erc20.attach(spirit);
    const tokenLqdr = await erc20.attach(lqdr);
    const tokenUsdc = await erc20.attach(usdc);
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
    let pairAddr = await router.connect(whaleSigner).getPair(usdc, dai);
    console.log(pairAddr);
    let amounts = await router.connect(whaleSigner).getAmount(usdc, dai, bal_usdc, bal_dai, 1, 1);
    console.log(amounts['amountA']);
    await tokenUsdc.connect(whaleSigner).approve(router.address, amounts['amountA']);
    await tokenDai.connect(whaleSigner).approve(router.address, amounts['amountB']);
    await router.connect(whaleSigner).safeTransfer(usdc, amounts['amountA']);
    await router.connect(whaleSigner).safeTransfer(dai, amounts['amountB']);
    let result = await router.connect(whaleSigner).addLiquidity(
      usdc,
      dai,
      amounts['amountA'],
      amounts['amountB'],
      1,
      1,
      whale,
      Date.now() + 60 * 60
    );
    console.log("ADDLIQUIDITY Result:", result);

  });
});
