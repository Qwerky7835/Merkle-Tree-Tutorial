const { MerkleTree } = require('merkletreejs');
const util = require('util');
const SHA256 = require('crypto-js/sha256');

// Email addresses for Alice, Bob and Charlie
const Alice = "alice@safe.global";
const Bob = "bob@safe.global";
const Charlie = "charlie@safe.global";

// Construct a Merkle tree with Alice, Bob and some random inputs
const leaves = ['a', 'b', 'c', Alice, Bob, 'd', 'e', 'e'].map(x => SHA256(x))
const merkleWhitelist = new MerkleTree(leaves, SHA256)

// Visual representation of tree and the root
console.log("A visual representation of the tree\n" + merkleWhitelist.toString());

const root = merkleWhitelist.getRoot().toString('hex');
console.log("The root is: " + root);

// Check if Alice is in the whitelist
const leafAlice = SHA256(Alice);
const proofAlice = merkleWhitelist.getProof(leafAlice)
if (merkleWhitelist.verify(proofAlice, leafAlice, root)){
    console.log(`The email address: ${Alice} is in the Whitelist\n`);
    console.log("The provided proof \n" + util.inspect(proofAlice, {showHidden: false, depth: null, colors: true}));
} else {
    console.log(`Forbidden: the email address: ${Alice} is not in the Whitelist \n`);
}

// Check if Charlie is in the Whitelist
const leafCharlie = SHA256(Charlie);
let proofCharlie = merkleWhitelist.getProof(leafCharlie);
console.log("The provided proof for Charlie while not in Whitelist: " + util.inspect(proofCharlie, {showHidden: false, depth: null, colors: true}));

// Verify if Charlie is on Whitelist
console.log("Charlie is on the Whitelist: " + merkleWhitelist.verify(proofCharlie, leafCharlie, root));

// Add Charlie to Whitelist and verify again
merkleWhitelist.addLeaf(leafCharlie);
proofCharlie = merkleWhitelist.getProof(leafCharlie);
console.log("Charlie is on the Whitelist after addition to Merkle Tree: " + merkleWhitelist.verify(proofCharlie, leafCharlie, root));