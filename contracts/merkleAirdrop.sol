// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20

/// ============ Imports ============

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";   // IERC20 Interface from OZ
import { MerkleProof } from "@openzeppelin/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof

/// @title MerkleAirdrop
/// @notice ERC20 claimable by members of a merkle tree


contract merkleAirdrop is ERC20 {

        IERC20 public token;

  bytes32 public immutable merkleRoot;


  /// @notice Mapping of addresses who have claimed tokens
  mapping(address => bool) public hasClaimed;

  /// ============ Errors ============

  /// @notice Thrown if address has already claimed
  error AlreadyClaimed();
  /// @notice Thrown if address/amount are not part of Merkle tree
  error NotInMerkle();

  /// ============ Constructor ============

  /// @notice Creates a new merkleAirdrop contract
  /// @param _name of token
  /// @param _symbol of token
  /// @param _decimals of token
  /// @param _merkleRoot of claimees
  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    bytes32 _merkleRoot
  ) ERC20(_name, _symbol, _decimals) {
    merkleRoot = _merkleRoot; // Update root
  }

  //Events to emit successful token claim
  event Claim(address indexed to, uint256 amount);

  //Functions to verify if claim has been made by token
  function claim(address to, uint256 amount, bytes32[] calldata proof) external {
    // Throw if address has already claimed tokens
    if (hasClaimed[to]) revert AlreadyClaimed();

    // Verify merkle proof, or revert if not in tree
    bytes32 leaf = keccak256(abi.encodePacked(to, amount));
    bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
    if (!isValidLeaf) revert NotInMerkle();

    // Set address to claimed
    hasClaimed[to] = true;

    // Mint tokens to address
    _mint(to, amount);

    // Emit claim event
    emit Claim(to, amount);
  }
}