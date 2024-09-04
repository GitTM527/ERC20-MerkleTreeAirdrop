import {StandardMerkleTree} from "@openzeppelin/merkle-tree";
import fs from 'fs';
import csv from 'csv-parser';
import keccak from 'keccak';
//import {MerkleTree} from 'merkletreejs';
//import { getRandomValues } from 'crypto';



const csvFilePath = `./airdropnew.csv`;
//const searchAddress = "0x156abc37d75aad4f4a7b1016ef4ba5d75d7dc410"; //Address to search

// Function to hash asingle entry using keccak256
// function hashEntry(address, amount) {
//     const amountStr = amount.toString();
//     const dataToHash = address + amountStr;
//     return keccak('keccak256').update(dataToHash).digest();

// }

//Read CSV function
async function readCSV(csvFilePath) {
    const values = [];

    return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data',(row) => {
        values.push([row.address, row.amount])
        //const {address, amount} = row;
       // const amountBigInt = BigInt(amount); //convert the string amount into BigInt
        //Hash each entry and convert to buffer
        //const hashedEntry = hashEntry(address, amountBigInt);
        //leaves.push(hashedEntry);
    })
    .on('end', () => {
        //Construct the Merkle Tree
        //const merkleTree = new MerkleTree(leaves, keccak, {sortPairs: true});
        //const merkleRoot = merkleTree.getRoot().toString('hex');

        //console.log('Merkle Root:', merkleRoot);
        resolve(values);
    })
    .on('error', reject);
    });
}

//function to generate the Merkle Tree
async function generateMerkleTree() {
    try{
        const values = await readCSV(csvFilePath);
        const merkletree = StandardMerkleTree.of(values, ["address", "uint256"]);
        console.log('Merkle Root:', merkletree.root);
        fs.writeFileSync("merkletree.json", JSON.stringify(merkletree.dump()));
    } catch (error) {
        console.error()
    }
}

//Generate proof Function
function generateMerkleProof() {
    try {
        const merkletree = StandardMerkleTree.load(
            JSON.parse(fs.readFileSync("merkletree.json", "utf8"))
        );
        for (const[i, v] of merkletree.entries()) {
            if (v[0] === searchAddress) {
                const proof = merkletree.getProof(i);
                console.log("Value:", v);
                console.log("Proof:", proof);
            }
        }
    } catch(error) {
        console.error("Error generating proof:", error)
    }
}

 
await generateMerkleTree();
await generateMerkleProof();
