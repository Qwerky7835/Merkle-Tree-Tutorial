# Lightning Tutorial: Merkle Trees

Merkle Trees are the heart of efficient change management. These data structures use the power of hashes to reflect changes in complex systems, no matter how large, in a clear and traceable manner. It is little wonder that they are the core power behind beloved technologies like Git - version control, NoSQL - database replication, Nix - package management, and many more.

### Quick Links

* [Introduction - What are Merkle Trees?](#Introduction---What-are-Merkle-Trees)
* [Implementation - Whitelisting Emails](#Implementation---Whitelisting-Emails)
* [Demonstration - Your first Merkle list](#Demonstration---Your-first-Merkle-list)
* Video walkthrough for visual learners - coming soon!

### Introduction - What are Merkle Trees?

![image](https://github.com/Qwerky7835/Merkle-Tree-Tutorial/assets/78215404/5c723f05-85ed-4ed8-aeae-69884ea482c0)

Merkle Trees are a specialized type of [tree](https://www.geeksforgeeks.org/introduction-to-tree-data-structure-and-algorithm-tutorials/) data structure. The *leaf* of the tree, the deepest layer, contains a hash of the data block that it represents. This data can be anything from files to a simple integer. The parents, in turn, contain a hash of its children. This pattern repeats itself until the root of the tree. In simple terms, **a Merkle Tree is a tree of recursive cryptographic hashes.**

Constructing a Merkle Tree data structure begins with hashing the relevant target elements. These then become the leaf nodes. Then, leaves are grouped, usually in pairs, and their hashes are hashed together to form the parent node. This process repeats until the root node , which then contains the hashes of the entire tree. Only the root needs to be stored and passed around to verify the inclusion or change of an element in the Merkle Tree.

Different flavours of Merkle Trees arise depending on the hashing algorithm used and the shape of the tree itself. However, all of them share the characteristic that any change in the leaf node, results in a clear path of hash changes from leaf to root. The root of a Merkle Tree can therefore be easily reconstructed from a *Merkle Proof* and a leaf node to check the validity of the leaf. It is possible to verify proof of inclusion of data to the Merkle tree, validity of changes, and most importantly, all without the need of revealing the exact content since information is presented in the form of a hash.

Merkle Trees are used widely in blockchain due to the fact that all changes are reflected block by block. This means we can compress all changes from one block to the next in a single Merkle root and verify the changes. In a Web 2 parallel, this is exactly how commits in Git are tracked and compared - each commit is a Merkle Root of the current filesystem version.

### Implementation - Whitelisting Emails

To make the above theory more concrete, imagine we want to have a whitelist, within which we would like to store a list of email addresses. Currently, the list contains the emails of Alice and Bob, amongst others. The tree may look something like this:

<img width="438" alt="image" src="https://github.com/Qwerky7835/Merkle-Tree-Tutorial/assets/78215404/f74631de-3e13-4289-9f6a-75b67525b9c7">

In order to compute a proof for an email address, which may or may not be on the whitelist, the prover must supply the hash of the target email address, as well as the *sibling* hashes at each layer of the tree, when traversing up the tree towards the root. The verifier will then attempt to calculate the Merkle Root based on the leaf node and the provided path with sibling hashes and compare to the true merkle root that it knows. At the code level, the verify function may be represented as: `Verify(leaf, proof, root);`

You may visualize a merkle proof using the below image. The selected target leaf node, in red, is used to build a path of *sibling* hashes towards the root. The proof will consist of the position of the sibling, in this case left or right and its hash. Additionally, run the code example below which prints out the exact proof array structure in code.

<img width="439" alt="image" src="https://github.com/Qwerky7835/Merkle-Tree-Tutorial/assets/78215404/6666550f-2de2-452d-83d4-5973047c6a68">

### Demonstration - Your first Merkle list :rocket:

This tutorial contains a Javascript code example demonstrating the use of a Merkle Tree and Proof using the [MerkleTreeJS](https://www.npmjs.com/package/merkletreejs) library, in order to build a Whitelist of emails. We have two existing users, Alice and Bob, already in the whitelist and will add a third, Charlie, to the whitelist.

##### Requirements and Installation
Make sure you have nodejs and npm installed. If not, use [nvm](https://github.com/nvm-sh/nvm) to install both.

Clone this repository to your local machine
```
git clone https://github.com/Qwerky7835/Merkle-Tree-Tutorial
```

Navigate into the repository and install the dependencies
```
cd Merkle-Tree-Tutorial
npm install
```

Finally, run the script
```
node app.js
```
You should see many lines printed to the console. What do they mean?

##### Code Walkthrough
To make use of the MerkleTree library, and some other utilities, we have to import them into our script.
```
const { MerkleTree } = require('merkletreejs');
const util = require('util');
const SHA256 = require('crypto-js/sha256');
```

In order to construct the Merkle Tree object, we must first specify the leaf node elements. In this case, we have the emails of Alice and Bob along with some other "email" data as strings. Recall that Merkle Trees are hashes from leaf to root, so we apply the map() function over the array to hash each element of the leaf array with a SHA hash. Once we have leaf hashes, we can utilize the library to create our MerkleTree and store its root.
```
const leaves = ['a', 'b', 'c', Alice, Bob, 'd', 'e', 'f'].map(x => SHA256(x)) // Hash of all leaves
const merkleWhitelist = new MerkleTree(leaves, SHA256) //Create Merkle tree Whitelist
const root = merkleWhitelist.getRoot().toString('hex'); //Store the root
```
Now that we have constructed the Merkle Tree, there are a few handy functions to verify if a leaf exists in this tree, or in our example, if an email is on the whitelist. First, we construct a Merkle Proof for the leaf with the proof() function. If you are curious, check out what the proof entails. You will notice it is an array of objects, which expands out into the hash and position of the node. Once the proof is generated, we can use the verify() function to check if Alice is really in the Merkle Tree whitelist.
```
// Check if Alice is in the whitelist
const leafAlice = SHA256(Alice); //Get the hashed leaf node
const proofAlice = merkleWhitelist.getProof(leafAlice); //Generate a Merkle Proof Based on the leaf node
merkleWhitelist.verify(proofAlice, leafAlice, root); //Verify if Alice is in list - should return true
```
The remainder of the code explores some additional behaviour and functions in the MerkleTree.js library. We try to compute a proof for Charlie before he is on the whitelist and the proof will come back as an empty array because no path was possible from the root to a non-existent leaf. We then add Charlie to the whitelist with the function addLeaf() and check if the verification shows up as true.
```
const leafCharlie = SHA256(Charlie); // Get Charlie's hash
let proofCharlie = merkleWhitelist.getProof(leafCharlie); // Attempt to generate proof for Charlie - impossible
merkleWhitelist.verify(proofCharlie, leafCharlie, root) // Verification is false
// Adding Charlie to whitelist
merkleWhitelist.addLeaf(leafCharlie); //Use the addLeaf() function
proofCharlie = merkleWhitelist.getProof(leafCharlie); //Generate the proof again
merkleWhitelist.verify(proofCharlie, leafCharlie, root); // Verification is true 
```

That's it! Now you can verify if objects are included in a group like emails on a whitelist.

### Repository Maintenance :sparkles:
For any issues or improvement please open a PR or issue. This repository is actively maintained.

If you liked this tutorial, give it a star!
