import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import chalk from "chalk";

const hre = require("hardhat");

const func: DeployFunction = async function () {
  const { fhenixjs, ethers } = hre;
  const { deploy } = hre.deployments;
  const [signer] = await ethers.getSigners();

  if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
    if (hre.network.name === "localfhenix") {
      await fhenixjs.getFunds(signer.address);
    } else {
        console.log(
            chalk.red("Please fund your account with testnet FHE from https://faucet.fhenix.zone"));
        return;
    }
  }

  // const token0 = await tokenFactory.connect(contractOwner).deploy();
  // const token1 = await tokenFactory.connect(contractOwner).deploy("Token1", "T1");
  const token0 = await deploy("EncryptedToken", {
    from: signer.address,
    args: ["Token0", "T0"],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  const token1 = await deploy("EncryptedToken", {
    from: signer.address,
    args: ["Token1", "T1"],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("token 0 : " + token0);
  console.log("token 1 : " + token1);

  const token0Address = await token0.address;
  const token1Address = await token1.address;

  console.log("token 0 address : " + token0Address);
  console.log("token 1 address : " + token1Address);

  // const mysticDEX = await hre.ethers.getContractFactory("MysticDEX");
  // const mysticdex = await mysticDEX.connect(contractOwner).deploy(token0Address, token1Address);
  const mysticDEX = await deploy("MysticDEX", {
    from: signer.address,
    args: [token0Address, token1Address],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("mystic dex : " + mysticDEX);
  // await mysticdex.waitForDeployment();
  // const address = await mysticdex.getAddress();
  // return { mysticdex, address, token0, token1 };
};

export default func;
func.id = "deploy_counter";
func.tags = ["Counter"];
