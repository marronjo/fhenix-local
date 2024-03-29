// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { inEuint32, euint32, inEbool } from "@fhenixprotocol/contracts/FHE.sol";

interface IEncryptedDEX {
    function swap(bool zeroForOne, inEuint32 calldata amountIn, bytes32 userPublicKey) external returns (euint32);
    function addLiquidity(inEuint32 calldata maxInAmount0, inEuint32 calldata maxInAmount1) external returns(euint32 poolShares);
    function withdrawLiquidity(inEuint32 calldata poolShares) external returns(euint32 amount0, euint32 amount1);
}