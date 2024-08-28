const {
    HermezAccount,
} = require("@hermeznetwork/commonjs");

let babyJobAccount = async () => {
    let account = new HermezAccount();
    console.log(`0x${account.bjjCompressed}`)
}

babyJobAccount()