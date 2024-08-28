// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.6.12;

import "./lib/InstantWithdrawManager.sol";
import "./interfaces/VerifierRollupInterface.sol";
import "./interfaces/VerifierWithdrawInterface.sol";
import "../interfaces/IHermezAuctionProtocol.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestEncodeData is InstantWithdrawManager {
    VerifierWithdrawInterface public withdrawVerifier = VerifierWithdrawInterface(
            0xA3766D7Bc150a8Fa2a7086afffD349f12C770594
        );
    uint256 public _RFIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;


    function encodeInput(
        uint32 tokenID,
        uint192 amount,
        uint32 _numExitRoot,
        uint48 idx
    ) public view returns(uint256)  {
        uint256 input = uint256(
            sha256(abi.encodePacked(_numExitRoot, msg.sender, tokenID, amount, idx))
        ) % _RFIELD;

        return  input;
    }

    function testVerifier(
        uint256[2] calldata proofA,
        uint256[2][2] calldata proofB,
        uint256[2] calldata proofC,
        uint256 input
    ) public view returns(bool)  {
          return  withdrawVerifier.verifyProof(proofA, proofB, proofC, [input]);
    }
}