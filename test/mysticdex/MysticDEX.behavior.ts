import { expect } from "chai";
import hre from "hardhat";

export function shouldBehaveLikeDEX(): void {
  it("should add some liquidity to pool", async function () {
    const liquidity = 100000;

    const encryptedLiquidity = await this.instance.instance.encrypt_uint32(
      liquidity,
    );
    
    await this.token0.connect(this.signers.admin).approveEncrypted(this.mysticdex.getAddress(), encryptedLiquidity);
    await this.token1.connect(this.signers.admin).approveEncrypted(this.mysticdex.getAddress(), encryptedLiquidity);


    await this.mysticdex.connect(this.signers.admin).addLiquidity(encryptedLiquidity, encryptedLiquidity);

    // await waitForBlock(hre);

    const encryptedSwapAmount = await this.instance.instance.encrypt_uint32(
      200,
    );

    const eAmount = await this.mysticdex
      .connect(this.signers.admin)
      .swap(true, encryptedSwapAmount, this.signers.admin.address);

    const amount = this.instance.instance.unseal(
      await this.mysticdex.getAddress(),
      eAmount.toString(),
    );

    console.log("amount out : ", amount);

    expect(Number(amount) <= 200);
  }).timeout(20000);
}
