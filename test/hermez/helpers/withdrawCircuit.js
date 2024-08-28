const {
    abi: hermezAbi
} = require("../../../artifacts/contracts/hermez/Hermez.sol/Hermez.json");
const {
    float40,
    RollupDB
} = require("@hermeznetwork/commonjs");
const SMTMemDB = require("circomlib").SMTMemDB;

let withDrawCircuit = async () => {
    const hermezSmartContractAddress = "0xA3d61e1e80aA100ee43772A14b651cB678d87A8F";
    const [owner] = await ethers.getSigners();

    const hardhatHermez = new ethers.Contract(hermezSmartContractAddress, hermezAbi, owner);
    const rollupDB = await RollupDB(new SMTMemDB(), 55007);

    const numExitRoot = await hardhatHermez.lastForgedBatch();
    const instantWithdraw = false;
    const state = await rollupDB.getStateByIdx(256);
    const exitInfo = await rollupDB.getExitTreeInfo(256, numExitRoot);

    const tokenID = 0;
    // const babyjub = `0x${accounts[0].bjjCompressed}`;
    const loadAmount = float40.round(1000);
    const fromIdx = 256;
    const amount = 1000;
    const amountF = float40.fix2Float(amount);

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
        loadAmount,
        9,
        fromIdx,
        instantWithdraw,
    )

    console.log('txRes:', txRes)
}

withDrawCircuit()