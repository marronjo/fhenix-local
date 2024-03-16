import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { shouldBehaveLikeDEX } from "./MysticDEX.behavior";
import { deployMysticDEXFixture, getTokensFromFaucet } from "./MysticDEX.fixture";
import hre from "hardhat";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // get tokens from faucet if we're on localfhenix and don't have a balance
    await getTokensFromFaucet();
    // deploy test contract
    const { mysticdex, address, token0, token1 } = await deployMysticDEXFixture();
    this.mysticdex = mysticdex;
    this.token0 = token0;
    this.token1 = token1;

    // initiate fhenixjs
    this.instance = await createFheInstance(hre, address);

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("MysticDEX", function () {
    shouldBehaveLikeDEX();
  }).timeout(1000000);
}).timeout(1000000);
