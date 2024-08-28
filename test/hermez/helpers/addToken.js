const { ethers } = require("hardhat");

let ABIbid = [
    "function permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
];

let {createPermitSignature} = require("./helpers")

let iface = new ethers.utils.Interface(ABIbid);

const {abi} = require("../../../artifacts/contracts/mock/ERC20PermitMock.sol/ERC20PermitMock.json")


const addToken = async () => {
    const [owner] = await ethers.getSigners();
    const mnemonic = "sphere defy lyrics agree solid sustain refuse say tape unaware oblige tiny";
    let ownerWallet = ethers.Wallet.fromMnemonic(mnemonic);
    
    const addressOwner = await ownerWallet.getAddress();
    const ERC20PermitMockAddress = "0x523202c8E080a4324b84849340b5aC027D2e663C"
    const hermezSmartContractAddress = "0xE3261E2161292f08099D7EA5Ab0691aE3843a87b"

    const hardhatHEZ = new ethers.Contract(ERC20PermitMockAddress, abi, owner);

    const tokenName = await hardhatHEZ.name();
  console.log("Token Name:", tokenName);

    const deadline = ethers.constants.MaxUint256;
    const nonce = await hardhatHEZ.nonces(addressOwner);
    const feeAddToken = 10;

    const { v, r, s } = await createPermitSignature(
        hardhatHEZ,
        ownerWallet,
        hermezSmartContractAddress,
        10,
        nonce,
        deadline
      );

    console.log("v %s, r %s, s %s", v, r, s)

    const data = iface.encodeFunctionData("permit", [
        await ownerWallet.getAddress(),
        hermezSmartContractAddress,
        feeAddToken,
        deadline,
        v,
        r,
        s
      ]);

    console.log("data:", data);
}

addToken()