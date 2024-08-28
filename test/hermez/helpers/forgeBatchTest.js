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

let forgeBatch = async () => {
    const accounts = [];
    for (let i = 0; i < 10; i++) {
        accounts.push(new HermezAccount());
    }

    const tokenInitialAmount = 1000000;
    const maxL1Tx = 256;
    const maxTx = 512;
    const nLevels = 32;
    const hermezSmartContractAddress = "0xA86FC1dC0ecAe98Ef6156e0419C7E22b656B7Cf3";
    const ERC20PermitMockAddress = "0xa81dCAf4BB070AD56921c8Cd458F79a047D59786";
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
        console.log("babyjub....", babyjub);
        // let l1 = await l1UserTxCreateAccountDeposit(loadAmount, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        l1TxUserArray.push("0x11b08df706a425d7a1b280d953e1576557402149107df19b834da09c8fdaaeb45b9730f9d12738f270e934aafb5b9ea0df6e343300000000000000000003e8000000000000000000000000000000");

        // let l2 = await l1UserTxCreateAccountDeposit(loadAmount1, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        // l1TxUserArray.push(l2);

        // let l3 = await l1UserTxCreateAccountDeposit(loadAmount, tokenID, babyjub, ownerWallet, hardhatHermez, hardhatTokenERC20Mock);
        // l1TxUserArray.push(l3);

        const l1TxCoordiatorArray = [];

        const chainSC = await hardhatHermez.getChainId();
        let chainID = chainSC.toNumber();
        let chainIDHex = chainSC.toHexString();

        // l1TxCoordiatorArray.push(await l1CoordinatorTxEth(0, "0x107df19b834da09c8fdaaeb45b9730f9d12738f270e934aafb5b9ea0df6e3433", owner, hardhatHermez, chainIDHex));
        // l1TxCoordiatorArray.push(await l1CoordinatorTxBjj(0, "0x107df19b834da09c8fdaaeb45b9730f9d12738f270e934aafb5b9ea0df6e3433", hardhatHermez));

        // console.log("L1 transactions:", l1TxUserArray);
        // console.log("Coordinator transactions:", l1TxCoordiatorArray);
        // 0x26f3f1151e79add3a7b680605c7fe4ae1cf46b9ea6ea5b4428135c64b233dca4
        // await forgerTest.forgeBatch(true, [], []);
        // await forgerTest.forgeBatch(true, l1TxUserArray, l1TxCoordiatorArray);

        // Initialize state for indices if needed
        for (let i = 255; i <= 258; i++) {
            await rollupDB.setState(i, {
                balance: 0,
                tokenID: tokenID,
                account: babyjub
            });
        }

        // withdraw circuit
        // const numExitRoot = await hardhatHermez.lastForgedBatch();
        // const instantWithdraw = true;

        // const fromIdx = 256;
        // const amount = 1000;

        // const proofA = ["0", "0"];
        // const proofB = [
        //     ["0", "0"],
        //     ["0", "0"],
        // ];
        // const proofC = ["0", "0"];

        // let txRes = await hardhatHermez.withdrawCircuit(
        //     proofA,
        //     proofB,
        //     proofC,
        //     tokenID,
        //     amount,
        //     numExitRoot,
        //     fromIdx,
        //     instantWithdraw,
        // )

        // console.log('txRes:', txRes);
        const numExitRoot = await hardhatHermez.lastForgedBatch();
        console.log("numExitRoot:", numExitRoot);
        const instantWithdraw = false;
        const amount = 1000;
        console.log("rollupDB:", rollupDB);

        const state = await rollupDB.getStateByIdx(258);
        if (!state) {
            console.error("State for index 258 is not found.");
            return;
        }
        console.log("state:", state);

        const exitInfo = await rollupDB.getExitTreeInfo(258, numExitRoot);
        if (!exitInfo) {
            console.error("Exit info for index 258 and numExitRoot-1 is not found.");
            return;
        }
        console.log("exitInfo:", exitInfo);

        // withdraw merkle proof
        const txRes = await hardhatHermez.withdrawMerkleProof(
            tokenID,
            amount,
            babyjub,
            numExitRoot,
            exitInfo.siblings,
            fromIdx,
            instantWithdraw
        );

        console.log("txRes:", txRes);

    } catch (error) {
        console.error("Error during forging batch:", error);
    }
};

forgeBatch().catch((error) => {
    console.error("Error in forgeBatch function:", error);
    process.exitCode = 1;
});


// rollupDB: RollupDB {
//     db: SMTMemDb {
//       nodes: {
//         '7856765775615529230272816404590788192234574497372841021456721238646954832328': 55007,
//         '21550472411895674261674024486793408679935534633042410802233873665046315343926': [Array],
//         '5513519635513406017842023992212510653827488546843920880087187880708502691240': 255,
//         '13654802487810442457840347957598544584656415464566513854876109627103317197311': 2,
//         '4985172801329728592957323657508621601155842706499840787767953158386278540886': [Array],
//         '11485204851104209073932356964174845443578673708802922237090756252645064249939': [Array],
//         '16350496273665127135155543729401242836548566685071943760037032610625062731833': [Array],
//         '12927605330109006417377427529883298018023259987055543143557224475641527890736': [Array],
//         '13016862816404764523736241198648856103601962088896321109586393190765773560250': [Array],
//         '3665103270992836271244080569834370473604056436162702606599754629264380354500': 15583651416432241190896399115053027902701774141500030436284857658499546360144n,
//         '15583651416432241190896399115053027902701774141500030436284857658499546360144': [Array],
//         '4371151630413739265538744589273419331301586137207149156832511131463098480822': [Array],
//         '1244043581662459902316579217822696817192065028180137617792807621848957660779': [Array],
//         '10407766140473982574186239141636715383398447537927745729073997074082369288319': [Array],
//         '13487215878491464859940050933724948967070619399441235167267404591031257970425': [Array],
//         '19701629971545556771498521030608272363491659161587315858738601392848130012611': [Array],
//         '21550472411895674261674024486793408679935534633042410802233873665046315343927': [Array],
//         '5513519635513406017842023992212510653827488546843920880087187880708502691241': 256
//       },
//       root: 0n
//     },
//     lastBatch: 2,
//     stateRoot: 19701629971545556771498521030608272363491659161587315858738601392848130012611n,
//     initialIdx: 256,
//     chainID: 55007
//   }
//   state: {
//     tokenID: 0,
//     nonce: 0,
//     sign: 1,
//     balance: 1000n,
//     ay: '13310766471ff2d562f5dcd9cd82e529d1f1ebc11cf4333507624c4dbb55117',
//     ethAddr: '0x11b08df706a425d7a1b280d953e1576557402149',
//     idx: 256
//   }