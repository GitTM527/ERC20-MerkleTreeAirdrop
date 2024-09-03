const fs = require('fs');
const csv = require('csv-parser');
const keccak256 = require('keccak');
const {MerkleTree} = require('merkletreejs')

//Function to hash asingle entry using keccak256
function hashEntry(address, amount) {
    return keccak256('keccak256').update(address + amount).digest();

}

//Read CSV and build Merkle Tree
function generateMerkleTree() {
    const csvFilePath = "/home/akhuemokhantobi/ERC20MerkleTreeAirdrop/general_files/airdropnew.csv";
    const leaves = [];

    //Read the CSV file
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data',(row) => {
        const {address, amount} = row;
        //Hash each entry 
        const hashedEntry = hashEntry(address, amount);
        leaves.push(hashEntry);
    })

    .on('end', () => {
        //Construct the Merkle Tree
        const merkleTree = new MerkleTree(leaves, keccak256,
            {sortPairs: true});
        const merkleRoot = merkleTree.getRoot().toString('hex');

        console.log('Merkle Root:', merkleRoot);
    });
}

// const csvFilePath = '/home/akhuemokhantobi/ERC20MerkleTreeAirdrop/general_files/airdropnew.csv';
// generateMerkleTree();