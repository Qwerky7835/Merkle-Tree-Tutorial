# Lightening Tutorial: Merkle Trees

Merkle Trees are the heart of efficient change management. These data structures use the power of hashes to reflect changes in complex systems, no matter how large, in a clear and traceable manner. It is little wonder that they are at the core, powering beloved technologies like Git - version control, NoSQL - database replication, Nix - package management, and many more.

### Quick Links

* Introduction - What are Merkle Trees?
* Implementation - Whitelisting Emails
* Demonstration - Your first Merkle list
* Video Walkthrough for visual leaners

### Introduction - What are Merkle Trees?

[Insert Image]

True to their name, Merkle Trees are a specilized type of tree data structure. The *leaf* of the tree, the deepest layer, contains a hash of the data block that it represents. This data can be anything from files to a simple integer. The parents, in turn, contain a hash of its children. This pattern repeats itself until the root of the tree. In simple terms, **a Merkle Tree is a tree of recursive cryptographic hashes.**

Different flavours of Merkle Trees arise depending on the hashing algorithm used and the shape of the tree itself. However, all of them share the characteristic that any change in the leaf node, results in a clear path of hash changes from leaf to root. This is why the root of a Merkle Tree is considered to be the basis of a *Merkle Proof*. Since the root and its changes are always known, we are able to calculate the validity of data associated with the tree. For example, does the data belong to the Merkle tree, if its recorded changes are correct, and most importantly, all without the need of revealing the exact content since everthing is in the form of a hash.

Merkle Trees are used widely in blockchain due to the fact that all changes are reflected block by block. This means we can compress all changes from one block to the next in a single Merkle root and verify the changes. In a Web 2 parallel, this is exactly how commits in Git are tracked and compared, each commit is simply a Merkle root.

### Implementation - Whitelisting Emails

To make the above theory more concrete, imagine we have want to have a whitelist, within which we would like to store a list of email addresses. Currently, the list contains the emails of Alice and Bob and Charlie amongst others. The tree may look something like this:

[Insert Image]

In order to compute a proof for Alice, Bob or Charlie, to prove that they are on the whitelist, we need to supply to the verifier the hash of the target email address, as well as the sibling hashes at each layer of the tree, when traversing up the tree towards the root. The verifier knows the Merkle root and computes it in a formula approximately like:
```
Bool whitelisted = Verify(leaf, proof, root);
```

With the proof consisting of the following hashes:

[Insert Image]

### Demonstration - Your first Merkle list

There are a number