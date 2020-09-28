const {
  ethers
} = require("@nomiclabs/buidler");
const {
  expect
} = require("chai");

const {
  time
} = require("@openzeppelin/test-helpers");

const ERC1820_REGISTRY_ADDRESS = "0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24";
const ERC1820_REGISTRY_DEPLOY_TX =
  "0xf90a388085174876e800830c35008080b909e5608060405234801561001057600080fd5b506109c5806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a5576000357c010000000000000000000000000000000000000000000000000000000090048063a41e7d5111610078578063a41e7d51146101d4578063aabbb8ca1461020a578063b705676514610236578063f712f3e814610280576100a5565b806329965a1d146100aa5780633d584063146100e25780635df8122f1461012457806365ba36c114610152575b600080fd5b6100e0600480360360608110156100c057600080fd5b50600160a060020a038135811691602081013591604090910135166102b6565b005b610108600480360360208110156100f857600080fd5b5035600160a060020a0316610570565b60408051600160a060020a039092168252519081900360200190f35b6100e06004803603604081101561013a57600080fd5b50600160a060020a03813581169160200135166105bc565b6101c26004803603602081101561016857600080fd5b81019060208101813564010000000081111561018357600080fd5b82018360208201111561019557600080fd5b803590602001918460018302840111640100000000831117156101b757600080fd5b5090925090506106b3565b60408051918252519081900360200190f35b6100e0600480360360408110156101ea57600080fd5b508035600160a060020a03169060200135600160e060020a0319166106ee565b6101086004803603604081101561022057600080fd5b50600160a060020a038135169060200135610778565b61026c6004803603604081101561024c57600080fd5b508035600160a060020a03169060200135600160e060020a0319166107ef565b604080519115158252519081900360200190f35b61026c6004803603604081101561029657600080fd5b508035600160a060020a03169060200135600160e060020a0319166108aa565b6000600160a060020a038416156102cd57836102cf565b335b9050336102db82610570565b600160a060020a031614610339576040805160e560020a62461bcd02815260206004820152600f60248201527f4e6f7420746865206d616e616765720000000000000000000000000000000000604482015290519081900360640190fd5b6103428361092a565b15610397576040805160e560020a62461bcd02815260206004820152601a60248201527f4d757374206e6f7420626520616e204552433136352068617368000000000000604482015290519081900360640190fd5b600160a060020a038216158015906103b85750600160a060020a0382163314155b156104ff5760405160200180807f455243313832305f4143434550545f4d4147494300000000000000000000000081525060140190506040516020818303038152906040528051906020012082600160a060020a031663249cb3fa85846040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182600160a060020a0316600160a060020a031681526020019250505060206040518083038186803b15801561047e57600080fd5b505afa158015610492573d6000803e3d6000fd5b505050506040513d60208110156104a857600080fd5b5051146104ff576040805160e560020a62461bcd02815260206004820181905260248201527f446f6573206e6f7420696d706c656d656e742074686520696e74657266616365604482015290519081900360640190fd5b600160a060020a03818116600081815260208181526040808320888452909152808220805473ffffffffffffffffffffffffffffffffffffffff19169487169485179055518692917f93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db15391a450505050565b600160a060020a03818116600090815260016020526040812054909116151561059a5750806105b7565b50600160a060020a03808216600090815260016020526040902054165b919050565b336105c683610570565b600160a060020a031614610624576040805160e560020a62461bcd02815260206004820152600f60248201527f4e6f7420746865206d616e616765720000000000000000000000000000000000604482015290519081900360640190fd5b81600160a060020a031681600160a060020a0316146106435780610646565b60005b600160a060020a03838116600081815260016020526040808220805473ffffffffffffffffffffffffffffffffffffffff19169585169590951790945592519184169290917f605c2dbf762e5f7d60a546d42e7205dcb1b011ebc62a61736a57c9089d3a43509190a35050565b600082826040516020018083838082843780830192505050925050506040516020818303038152906040528051906020012090505b92915050565b6106f882826107ef565b610703576000610705565b815b600160a060020a03928316600081815260208181526040808320600160e060020a031996909616808452958252808320805473ffffffffffffffffffffffffffffffffffffffff19169590971694909417909555908152600284528181209281529190925220805460ff19166001179055565b600080600160a060020a038416156107905783610792565b335b905061079d8361092a565b156107c357826107ad82826108aa565b6107b85760006107ba565b815b925050506106e8565b600160a060020a0390811660009081526020818152604080832086845290915290205416905092915050565b6000808061081d857f01ffc9a70000000000000000000000000000000000000000000000000000000061094c565b909250905081158061082d575080155b1561083d576000925050506106e8565b61084f85600160e060020a031961094c565b909250905081158061086057508015155b15610870576000925050506106e8565b61087a858561094c565b909250905060018214801561088f5750806001145b1561089f576001925050506106e8565b506000949350505050565b600160a060020a0382166000908152600260209081526040808320600160e060020a03198516845290915281205460ff1615156108f2576108eb83836107ef565b90506106e8565b50600160a060020a03808316600081815260208181526040808320600160e060020a0319871684529091529020549091161492915050565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff161590565b6040517f01ffc9a7000000000000000000000000000000000000000000000000000000008082526004820183905260009182919060208160248189617530fa90519096909550935050505056fea165627a7a72305820377f4a2d4301ede9949f163f319021a6e9c687c292a5e2b2c4734c126b524e6c00291ba01820182018201820182018201820182018201820182018201820182018201820a01820182018201820182018201820182018201820182018201820182018201820";

const COORDINATOR_1_URL = "https://hermez.io";
const COORDINATOR_1_URL_2 = "https://new.hermez.io";

const BLOCKS_PER_SLOT = 40;
const TIMEOUT = 40000;

const MIN_BLOCKS = 81;

let ABIbid = [
  "function bid(uint128 slot, uint128 bidAmount, address producer)",
  "function multiBid(uint128 startingSlot,uint128 endingSlot,bool[6] slotEpoch,uint128 maxBid,uint128 minBid,address forger)",
];
let iface = new ethers.utils.Interface(ABIbid);

describe("Auction Protocol", function() {
  this.timeout(TIMEOUT);

  let buidlerHEZToken;
  let buidlerHermezAuctionProtocol;
  let owner,
    coordinator1,
    coordinator2,
    registryFunder,
    hermezRollup,
    bootCoordinator,
    donation,
    governance;

  let governanceAddress, hermezRollupAddress, donationAddress;

  // Deploy
  before(async function() {
    const HEZToken = await ethers.getContractFactory("ERC777Mock");

    [
      owner,
      coordinator1,
      coordinator2,
      producer2,
      registryFunder,
      hermezRollup,
      donation,
      governance,
      bootCoordinator,
      ...addrs
    ] = await ethers.getSigners();

    governanceAddress = await governance.getAddress();
    bootCoordinator = await governance.getAddress();
    hermezRollupAddress = await hermezRollup.getAddress();
    donationAddress = await donation.getAddress();

    if ((await ethers.provider.getCode(ERC1820_REGISTRY_ADDRESS)) == "0x") {
      await registryFunder.sendTransaction({
        to: "0xa990077c3205cbDf861e17Fa532eeB069cE9fF96",
        value: ethers.utils.parseEther("0.08"),
      });
      await ethers.provider.sendTransaction(ERC1820_REGISTRY_DEPLOY_TX);
    }

    buidlerHEZToken = await HEZToken.deploy(
      await owner.getAddress(),
      ethers.BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"),
      "HEZToken",
      "HEZ",
      []
    );
    await buidlerHEZToken.deployed();
    // Send tokens to coordinators addresses
    await buidlerHEZToken
      .connect(owner)
      .send(
        await coordinator1.getAddress(),
        ethers.utils.parseEther("10000"),
        ethers.utils.toUtf8Bytes("")
      );

    await buidlerHEZToken
      .connect(owner)
      .send(
        await coordinator2.getAddress(),
        ethers.utils.parseEther("10000"),
        ethers.utils.toUtf8Bytes("")
      );
  });

  beforeEach(async function() {
    const HermezAuctionProtocol = await ethers.getContractFactory(
      "HermezAuctionProtocol"
    );

    buidlerHermezAuctionProtocol = await HermezAuctionProtocol.deploy();
    await buidlerHermezAuctionProtocol.deployed();

    // Wait for pending blocks
    let current = await time.latestBlock();
    time.advanceBlock();
    let latest = (await time.latestBlock()).toNumber();
    while (current >= latest) {
      sleep(100);
      latest = (await time.latestBlock()).toNumber();
    }

    await expect(
      buidlerHermezAuctionProtocol.hermezAuctionProtocolInitializer(
        buidlerHEZToken.address,
        latest + (MIN_BLOCKS - 10),
        hermezRollupAddress,
        governanceAddress,
        donationAddress,
        bootCoordinator
      )
    ).to.be.revertedWith("Genesis smaller than minimal");

    await buidlerHermezAuctionProtocol.hermezAuctionProtocolInitializer(
      buidlerHEZToken.address,
      latest + 1 + MIN_BLOCKS,
      hermezRollupAddress,
      governanceAddress,
      donationAddress,
      bootCoordinator
    );
  });

  it("shouldn't be able to initialize twice", async function() {
    await expect(
      buidlerHermezAuctionProtocol.hermezAuctionProtocolInitializer(
        buidlerHEZToken.address,
        MIN_BLOCKS,
        hermezRollupAddress,
        governanceAddress,
        donationAddress,
        bootCoordinator
      )
    ).to.be.revertedWith("Contract instance has already been initialized");
  });

  describe("Coordinator registration", function() {
    beforeEach(async function() {
      // Register Coordinator
      await buidlerHermezAuctionProtocol
        .connect(coordinator1)
        .registerCoordinator(COORDINATOR_1_URL);
    });
    it("should register a producer/coordinator", async function() {
      // Get registered coordinator
      let coordinator = await buidlerHermezAuctionProtocol.coordinators(
        await coordinator1.getAddress()
      );
      // Check coordinator URL
      expect(coordinator.coordinatorURL).to.equal(COORDINATOR_1_URL);
    });
    it("shouldn't register a producer that was already registered", async function() {
      // Try to register the same coordinator
      await expect(
        buidlerHermezAuctionProtocol
        .connect(coordinator1)
        .registerCoordinator(COORDINATOR_1_URL)
      ).to.be.revertedWith("Already registered");
    });
    it("should be able to update a producer with a new address and url", async function() {
      // Update coordinator information
      await buidlerHermezAuctionProtocol
        .connect(coordinator1)
        .updateCoordinatorInfo(
          COORDINATOR_1_URL_2
        );
      // Get registered coordinator with new information
      let coordinator = await buidlerHermezAuctionProtocol.coordinators(
        await coordinator1.getAddress()
      );

      // Check new coordinator URL
      expect(coordinator.coordinatorURL).to.equal(COORDINATOR_1_URL_2);
    });
    it("shouldn't update a producer that wasn't already registered", async function() {
      // Try to update the information of an unregistered coordinator
      await expect(
        buidlerHermezAuctionProtocol
        .connect(coordinator2)
        .updateCoordinatorInfo(
          COORDINATOR_1_URL_2
        )
      ).to.be.revertedWith("Forger doesn't exists");
    });
  });

  describe("Send HEZ", function() {
    // Register Coordinator
    beforeEach(async function() {
      await buidlerHermezAuctionProtocol
        .connect(coordinator1)
        .registerCoordinator(COORDINATOR_1_URL);
    });

    it("should revert if we try to send a different ERC777", async function() {
      // Deploy different ERC777 contract
      const ERC777 = await ethers.getContractFactory("ERC777Mock");
      let buidlerERC777 = await ERC777.deploy(
        await owner.getAddress(),
        ethers.utils.parseEther("1000000"),
        "HEZToken",
        "HEZ",
        []
      );
      await buidlerERC777.deployed();
      // Try to send a invalid ERC777 token
      await expect(
        buidlerERC777.send(
          buidlerHermezAuctionProtocol.address,
          ethers.utils.parseEther("10"),
          ethers.utils.toUtf8Bytes("")
        )
      ).to.be.revertedWith("Invalid ERC777 token");
    });
    it("should revert if we try to send more than 2^128", async function() {
      let amount = ethers.BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
      let slot = 10;
      let producer = await coordinator1.getAddress();
      let data = iface.encodeFunctionData("bid", [slot, amount, producer]);
      // Send bid data and amount
      await expect(
        buidlerHEZToken.send(
          buidlerHermezAuctionProtocol.address,
          ethers.BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"),
          data
        )
      ).to.be.revertedWith("Amount must be less than 2_128");
    });

    it("should send 10 HEZ to the contract", async function() {
      // NewBid event
      let eventNewBid = new Promise((resolve, reject) => {
        filter = buidlerHermezAuctionProtocol.filters.NewBid();
        buidlerHermezAuctionProtocol.on(filter, () => {
          resolve();
        });

        setTimeout(() => {
          reject(new Error("timeout while waiting for event"));
        }, TIMEOUT);
      });

      // Encode function data
      let amount = ethers.utils.parseEther("15");
      let slot = 10;
      let producer = await coordinator1.getAddress();
      let data = iface.encodeFunctionData("bid", [slot, amount, producer]);
      // Send bid data and amount
      await buidlerHEZToken
        .connect(coordinator1)
        .send(buidlerHermezAuctionProtocol.address, amount, data);
      await eventNewBid;
    });
  });

  describe("Slot info", function() {
    it("should return slot 0 before starting", async function() {
      // Get current slot number
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(0);

      let genesis = (
        await buidlerHermezAuctionProtocol.genesisBlock()
      ).toNumber();
      // Advance to block genesis - 40
      await time.advanceBlockTo(genesis - 40);
      // Check that the current slot is still 0 (Delay Genesis)
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(0);
    });
    it("should return the correct slot at #1150=>0, #1205=>1, #1245=>2, #1365=>5, #1565=>10 starting at block #1150", async function() {
      let relative_block = 15;
      // Get starting Block
      let startingBlock = (
        await buidlerHermezAuctionProtocol.genesisBlock()
      ).toNumber();
      // Advance blocks
      await time.advanceBlockTo(startingBlock + relative_block);
      // Check current slot
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(
        Math.floor(
          ((await time.latestBlock()) - startingBlock) / BLOCKS_PER_SLOT
        )
      );

      // Advance blocks to next slot
      slot_step = 1;
      await time.advanceBlockTo(
        (await time.latestBlock()).toNumber() + slot_step * BLOCKS_PER_SLOT
      );
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(
        Math.floor(
          ((await time.latestBlock()) - startingBlock) / BLOCKS_PER_SLOT
        )
      );

      // Advance blocks to next slot
      slot_step = 1;
      await time.advanceBlockTo(
        (await time.latestBlock()).toNumber() + slot_step * BLOCKS_PER_SLOT
      );
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(
        Math.floor(
          ((await time.latestBlock()) - startingBlock) / BLOCKS_PER_SLOT
        )
      );

      // Advance blocks of 3 slots
      slot_step = 3;
      await time.advanceBlockTo(
        (await time.latestBlock()).toNumber() + slot_step * BLOCKS_PER_SLOT
      );
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(
        Math.floor(
          ((await time.latestBlock()) - startingBlock) / BLOCKS_PER_SLOT
        )
      );

      // Advance blocks of 5 slots
      slot_step = 5;
      await time.advanceBlockTo(
        (await time.latestBlock()).toNumber() + slot_step * BLOCKS_PER_SLOT
      );
      expect(
        await buidlerHermezAuctionProtocol.getCurrentSlotNumber()
      ).to.be.equal(
        Math.floor(
          ((await time.latestBlock()) - startingBlock) / BLOCKS_PER_SLOT
        )
      );
    });
  });
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}