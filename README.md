# MERKLETREE AIRDROP USING THE ERC20 TOKEN STANDARD

The MerkleTree Airdrop project implement a Smart Contract merkleAdrop.sol for an airdrop. The Airdrop uses a Merkle Tree for whitelistiing addresses. The root hash of the Merkle Tree is generated using the merkle.js file from a list of eligible addresses compile in a airdropnew.csv file. The smart contract verifies claims against the Merkle Root and aswell manage the airdrop processes. 

# CSV FILE SYSTEM
The CSV File, airdropnew.csv, contains a list of addresses and the corresponding amount of tokens each address is eligible to receive in the format below

address, amount
0x123...abc, 100
0x456...def, 200 

# THE MERKLE TREE
The Merkle.js file is a javascript file that reads the