const {HermezAccount, float40} = require("@hermeznetwork/commonjs");
const Scalar = require("ffjavascript").Scalar;

let hermezAccount = () => {
    const fromIdx = 256;
    const toIdx = 257;
    const emptyPermit = "0x";
    const amountF = float40.round(10);
    const tokenID = 0;

    const loadAmountF = float40.fix2Float(amountF);

    const babyjub0 = 0;

    // console.log("babyjub0:", babyjub0);
    console.log("fromIdx:", fromIdx);
    console.log("loadAmountF:", loadAmountF);
    console.log("amountF:", amountF);
    console.log("tokenID:", tokenID);
    console.log("toIdx:", toIdx);
    console.log("emptyPermit:", emptyPermit);

    let account = new HermezAccount();
    const babyjub = `0x${account.bjjCompressed}`;
    console.log("babyjub:", babyjub);
    
}

hermezAccount()