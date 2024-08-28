const {
    ethers
} = require("hardhat");
const {
    float40,
    HermezAccount,
    RollupDB
} = require("@hermeznetwork/commonjs");
const SMTMemDB = require("circomlib").SMTMemDB;
const {
    ForgerTest,
    l1CoordinatorTxEth,
    l1CoordinatorTxBjj,
    createAccounts,
    l1UserTxCreateAccountDeposit,
    l1UserTxDeposit
} = require("./helpers");
const {
    abi: hermezAbi
} = require("../../../artifacts/contracts/hermez/Hermez.sol/Hermez.json");
const {
    abi: erc20PermitMockAbi
} = require("../../../artifacts/contracts/mock/ERC20PermitMock.sol/ERC20PermitMock.json");
const { babyJub } = require("circomlib");

let forgeBatch = async () => {
    const accounts = [];
    for (let i = 0; i < 10; i++) {
        accounts.push(new HermezAccount());
    }

    const tokenInitialAmount = 1000000;
    const maxL1Tx = 256;
    const maxTx = 512;
    const nLevels = 32;
    const hermezSmartContractAddress = "0xA3d61e1e80aA100ee43772A14b651cB678d87A8F";
    const ERC20PermitMockAddress = "0x292541bFDE71eCCa5C23aBe1e5bB110a231391E4";
    const tokenID = 0;
    const babyjub = `0x${accounts[0].bjjCompressed}`;
    const loadAmount = float40.round(1000);
    const loadAmount1 = float40.round(1200);
    const fromIdx = 256;
    const toIdx = 257;
    const amountF = float40.fix2Float(10);

    const provider = ethers.provider;
    const mnemonic = "sphere defy lyrics agree solid sustain refuse say tape unaware oblige tiny";
    let ownerWallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

    const [owner] = await ethers.getSigners();

    const hardhatHermez = new ethers.Contract(hermezSmartContractAddress, hermezAbi, owner);
    const hardhatTokenERC20Mock = new ethers.Contract(ERC20PermitMockAddress, erc20PermitMockAbi, owner);

    const rollupDB = await RollupDB(new SMTMemDB(), 55007);

    const forgerTest = new ForgerTest(maxTx, maxL1Tx, nLevels, hardhatHermez, rollupDB);

    console.log("Initialized forgerTest");

    try {
        const l1TxUserArray = [];
        console.log("babyjub....", babyjub)
        // let l1 = await l1UserTxCreateAccountDeposit(loadAmount, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        // l1TxUserArray.push("0x11b08df706a425d7a1b280d953e15765574021491ff8c71d3a7aa91de8cd9c09070d3a44511544a7e89aac3ce2729a5239cdee4e00000000000000000003e8000000000000000000000000000000");

        // let l2 = await l1UserTxCreateAccountDeposit(loadAmount1, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        // l1TxUserArray.push(l2);

        // let l3 = await l1UserTxCreateAccountDeposit(loadAmount, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        // l1TxUserArray.push(l3);

        const l1TxCoordiatorArray = [];

        // const chainSC = await hardhatHermez.getChainId();
        // let chainID = chainSC.toNumber();
        // let chainIDHex = chainSC.toHexString();

        // l1TxCoordiatorArray.push(await l1CoordinatorTxEth(0, "0x813310766471ff2d562f5dcd9cd82e529d1f1ebc11cf4333507624c4dbb55117", owner, hardhatHermez, chainIDHex));
        // l1TxCoordiatorArray.push(await l1CoordinatorTxBjj(0, "0x813310766471ff2d562f5dcd9cd82e529d1f1ebc11cf4333507624c4dbb55117", hardhatHermez));

        // console.log("L1 transactions:", l1TxUserArray);
        // console.log("Coordinator transactions:", l1TxCoordiatorArray);
        // 0x26f3f1151e79add3a7b680605c7fe4ae1cf46b9ea6ea5b4428135c64b233dca4
        // await forgerTest.forgeBatch(true, [], []);
        // await forgerTest.forgeBatch(true, l1TxUserArray, l1TxCoordiatorArray);


        // withdraw circuit
        const numExitRoot = await hardhatHermez.lastForgedBatch();
        const instantWithdraw = true;

        const fromIdx = 256;
        const amount = 0;

        const proofA = ["0", "0"];
        const proofB = [
            ["0", "0"],
            ["0", "0"],
        ];
        const proofC = ["0", "0"];

        let txRes = await hardhatHermez.withdrawCircuit(
            proofA,
            proofB,
            proofC,
            tokenID,
            amount,
            numExitRoot,
            fromIdx,
            instantWithdraw,
        )
        console.log('txRes:', txRes)

        // const numExitRoot = await hardhatHermez.lastForgedBatch();
        // console.log("numExitRoot:", numExitRoot);
        // const instantWithdraw = false;
        // const amount = 1000;
        // console.log("rollupDB:", rollupDB);
        // const state = await rollupDB.getStateByIdx(256);
        // console.log("state:", state);
        // const exitInfo = await rollupDB.getExitTreeInfo(256, numExitRoot);
        // console.log("exitInfo:", exitInfo);
        // const exitInfo1 = await rollupDB.getExitTreeInfo(255, numExitRoot-1);
        // console.log("exitInfo:", exitInfo1);


        // // withdraw merkle proof
        // txRes = await hardhatHermez.withdrawMerkleProof(
        //     tokenID,
        //     amount,
        //     babyJub,
        //     numExitRoot,
        //     exitInfo.sibling,
        //     fromIdx,
        //     instantWithdraw
        //   )

    } catch (error) {
        console.error("Error during forging batch:", error);
    }
};

forgeBatch().catch((error) => {
    console.error("Error in forgeBatch function:", error);
    process.exitCode = 1;
});
