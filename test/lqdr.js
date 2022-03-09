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
    const dai = "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E";//Dai Stablecoin
    const spirit = "0x5Cc61A78F164885776AA610fb0FE1257df78E59B";//Spirit
    const mim = "0x82f0B8B456c1A451378467398982d4834b6829c1";//Magic Internet Money
    const to = "0xAdf9319359718fa2320Af2CA96d7Fc024329c928";
    await hre.network.provider.send("hardhat_impersonateAccount", [whale]);
    const whaleSigner = await ethers.provider.getSigner(whale);

    const tokenDai = await erc20.attach(dai);
    const tokenMim = await erc20.attach(mim);
    const tokenSpirit = await erc20.attach(spirit);
    let fweth = await router.connect(whaleSigner).getWETH();
    console.log(fweth);
    
    let amountADesired = await router.connect(whaleSigner).getAmountsIn(getBigNumber(100, 18), [fweth, tokenDai.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountADesired[0],
      [fweth, tokenDai.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(100, 18)
      }
    );
    console.log("DAI token's balance:", await tokenDai.balanceOf(whale));

    let amountBDesired = await router.connect(whaleSigner).getAmountsIn(getBigNumber(100, 18), [fweth, tokenMim.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountBDesired[0],
      [fweth, tokenMim.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(100, 18)
      }
    );
    console.log("MIM token's balance:", await tokenMim.balanceOf(whale));

    let amountCDesired = await router.connect(whaleSigner).getAmountsIn(getBigNumber(100, 18), [fweth, tokenSpirit.address]);
    await router.connect(whaleSigner).swapETHForExactTokens(
      amountCDesired[0],
      [fweth, tokenSpirit.address],
      whale,
      Date.now() + 60 * 60,//,   // deadline
      {
        value: getBigNumber(100, 18)
      }
    );
    console.log("SPIRIT token's balance:", await tokenSpirit.balanceOf(whale));
    
    // let result = await router.connect(whaleSigner).addLiquidityETH(
    //   spirit,
    //   getBigNumber(2, 18),
    //   getBigNumber(1, 18),
    //   1,
    //   whale,
    //   Date.now() + 60 * 60,
    //   {
    //     value: getBigNumber(2, 18)
    //   }
    // );
    // console.log("ADDLIQUIDITYETH Result:", result);

    // let result = await router.connect(whaleSigner).addLiquidity(
    //   spirit,
    //   mim,
    //   getBigNumber(85, 18),
    //   getBigNumber(85, 18),
    //   1,
    //   1,
    //   whale,
    //   Date.now() + 60 * 60
    // );
    // console.log("ADDLIQUIDITY Result:", result);
  });
});
