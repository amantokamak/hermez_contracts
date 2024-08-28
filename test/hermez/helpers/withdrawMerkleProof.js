const {
    ethers
} = require("hardhat");
const crypto = require("crypto");
const {
    float40,
    HermezAccount,
    RollupDB
} = require("@hermeznetwork/commonjs");
const {
    buildPoseidon
} = require("circomlibjs");
const SMTMemDB = require("circomlib").SMTMemDB;
const {
    abi: hermezAbi
} = require("../../../artifacts/contracts/hermez/Hermez.sol/Hermez.json");
const {
    abi: erc20PermitMockAbi
} = require("../../../artifacts/contracts/mock/ERC20PermitMock.sol/ERC20PermitMock.json");
const {
    l1UserTxCreateAccountDeposit,
    l1UserTxForceExit,
    ForgerTest,
} = require("./helpers");


async function forgeBatch() {
    const accounts = [];
    for (let i = 0; i < 10; i++) {
        accounts.push(new HermezAccount());
    }

    const maxL1Tx = 256;
    const maxTx = 512;
    const nLevels = 32;
    const hermezSmartContractAddress = "0xA3d61e1e80aA100ee43772A14b651cB678d87A8F";
    const ERC20PermitMockAddress = "0x292541bFDE71eCCa5C23aBe1e5bB110a231391E4";
    const tokenID = 0;
    const babyjub = `0x${accounts[0].bjjCompressed}`;
    const loadAmount = float40.round(1000);
    const fromIdx = 256;

    const provider = ethers.provider;
    const mnemonic = "sphere defy lyrics agree solid sustain refuse say tape unaware oblige tiny";
    const ownerWallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
    const [owner] = await ethers.getSigners();

    const hardhatHermez = new ethers.Contract(hermezSmartContractAddress, hermezAbi, owner);
    const hardhatTokenERC20Mock = new ethers.Contract(ERC20PermitMockAddress, erc20PermitMockAbi, owner);

    // Create Poseidon hash function
    const poseidon = await buildPoseidon();

    // Function to generate leaf for the Merkle tree
    const generateLeaf = (tokenID, amount, babyjub, address) => {
        // Make sure nonce is a number and converted to string correctly
        return poseidon.F.toString(poseidon([tokenID, babyjub, amount, address]));
    };

    // Function to build the Merkle tree and return the root and siblings
    const buildMerkleTree = (leaves) => {
        let currentLevel = leaves;
        const tree = [currentLevel]; // Store all levels of the tree

        while (currentLevel.length > 1) {
            const nextLevel = [];

            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = currentLevel[i + 1] || left; // Handle odd number of leaves
                const parentHash = poseidon.F.toString(poseidon([left, right]));
                nextLevel.push(parentHash);
            }
            tree.push(nextLevel);
            currentLevel = nextLevel;
        }

        return {
            root: currentLevel[0], // Merkle root
            tree
        };
    };

    // Function to extract the Merkle proof (siblings) for a given leaf
    const getMerkleProof = (leafIndex, tree) => {
        const proof = [];
        let currentIndex = leafIndex;

        for (let level = 0; level < tree.length - 1; level++) {
            const currentLevel = tree[level];
            const isRightNode = currentIndex % 2 !== 0;
            const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

            if (siblingIndex < currentLevel.length) {
                proof.push(currentLevel[siblingIndex]);
            }

            // Move up to the next level
            currentIndex = Math.floor(currentIndex / 2);
        }

        return proof;
    };

    try {
        const chainSC = await hardhatHermez.getChainId();
        const chainID = chainSC.toNumber();
        const chainIDHex = chainSC.toHexString();
        const rollupDB = await RollupDB(new SMTMemDB(), chainID);

        const forgerTest = new ForgerTest(
            maxTx,
            maxL1Tx,
            nLevels,
            hardhatHermez,
            rollupDB
        );

        const l1TxUserArray = [];
        let l1 = await l1UserTxCreateAccountDeposit(loadAmount, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        l1TxUserArray.push(l1);

        const l1TxCoordiatorArray = [];
        await forgerTest.forgeBatch(true, [], []);
        await forgerTest.forgeBatch(true, l1TxUserArray, l1TxCoordiatorArray);

        const leaves = [];

        // Generate leaves for each account
        for (let i = 0; i < accounts.length; i++) {
        const account = accounts[0];
        const address = account.ethAddr;
        const nonce = await hardhatTokenERC20Mock.nonces(address);
        const leaf = generateLeaf(tokenID, loadAmount, babyjub, address);
        leaves.push(leaf);
        }

        // Build Merkle tree and get the root
        const {
            root,
            tree
        } = buildMerkleTree(leaves);
        console.log("Merkle Root:", root);

        // Get the Merkle proof (siblings) for a specific leaf
        const leafIndex = 0; // Change this to target different leaves
        const siblings = getMerkleProof(leafIndex, tree);

        // Log siblings to debug
        console.log("Merkle Proof (siblings):", siblings);

        // Ensure siblings are in the correct format
        const formattedSiblings = siblings.map(sibling => ethers.BigNumber.from(sibling).toHexString());
        console.log("formattedSiblings:", formattedSiblings);

        // // Withdraw with Merkle proof
        const numExitRoot = await hardhatHermez.lastForgedBatch();

        // console.log("accountsaccounts.......", accounts[0])
        const exitInfo = await rollupDB.getExitTreeInfo(fromIdx, numExitRoot);
        console.log("exitInfo:", exitInfo)

        // // Ensure amount is in the correct format (e.g., using BigNumber)
        const amount = ethers.utils.parseUnits('1000', 18);
        instantWithdraw = true;

        const txRes = await hardhatHermez.withdrawMerkleProof(
            tokenID,
            amount,
            babyjub,
            numExitRoot,
            formattedSiblings,
            fromIdx,
            instantWithdraw
        );

        // console.log("Withdraw successful", txRes);
    } catch (error) {
        console.error("Error during forging batch:", error);
    }
}

forgeBatch().catch((error) => {
    console.error("Error in forgeBatch function:", error);
});