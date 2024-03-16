import type { MysticDEX, EncryptedToken } from "../../types";
import axios from "axios";
import hre from "hardhat";

export async function deployMysticDEXFixture(): Promise<{
  mysticdex: MysticDEX;
  address: string;
  token0: EncryptedToken;
  token1: EncryptedToken;
}> {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  console.log(contractOwner.address);

  const tokenFactory = await hre.ethers.getContractFactory("EncryptedToken");

  console.log("token factory : " + tokenFactory);

  const token0 = await tokenFactory.connect(contractOwner).deploy("Token0", "T0");
  const token1 = await tokenFactory.connect(contractOwner).deploy("Token1", "T1");

  console.log("token 0 : " + token0);
  console.log("token 1 : " + token1);

  await token0.waitForDeployment();
  await token1.waitForDeployment();

  const token0Address = await token0.getAddress();
  const token1Address = await token1.getAddress();

  console.log("token 0 address : " + token0Address);
  console.log("token 1 address : " + token1Address);

  const mysticDEX = await hre.ethers.getContractFactory("MysticDEX");

  console.log("mystic dex factory : " + mysticDEX);
  const mysticdex = await mysticDEX.connect(contractOwner).deploy(token0Address, token1Address);

  console.log("mystic dex : " + mysticdex);

  await mysticdex.waitForDeployment();
  const address = await mysticdex.getAddress();
  return { mysticdex, address, token0, token1 };
}

export async function getTokensFromFaucet() {
  if (hre.network.name === "localfhenix") {
    const signers = await hre.ethers.getSigners();

    if (
      (await hre.ethers.provider.getBalance(signers[0].address)).toString() ===
      "0"
    ) {
      await hre.fhenixjs.getFunds(signers[0].address);
    }
  }
}
