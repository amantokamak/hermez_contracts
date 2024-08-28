## Remixd
remixd -s ../hermez\ contracts -u https://remix.ethereum.org  

## deploy/verify test net
npx hardhat run --network titan_sepolia scripts/deployment-testnet/deploy.js 
npx hardhat run --network titan_sepolia scripts/deployment-testnet/verifyContracts.js

npx hardhat --network titan_sepolia verify 0x18cD995f4B19e79aefC67364677d8C3c4ae5555A

# Smart-contracts

Implements Hermez smart contracts

### Install

```
$ yarn install && cp .env.example .env
```

#### Add pre-commit hook
```
$ git config core.hooksPath .githooks
```

Optional:

- `cp .env.example .env`
- Add your vars to .env after this commnad

### Run tests

- #### Contracts tests

```
$ yarn run test
```

Or for a specific contract:

```
$ yarn run test:hermez
$ yarn run test:auction
$ yarn run test:withdrawalDelayer
```

- #### Contracts Coverage

```
$ yarn run test:coverage
```

Or for a specific contract:

```
$ yarn run test:coverage:hermez
$ yarn run test:coverage:auction
$ yarn run test:coverage:withdrawalDelayer
```

- #### Contracts Gas Report

```
$ yarn run test:gas
```

Or for a specific contract:

```
$ yarn run test:gas:hermez
$ yarn run test:gas:auction
$ yarn run test:gas:withdrawalDelayer
```

## License

hermeznetwork/contracts is part of the Hermez project copyright 2020 HermezDAO and published with GPL-3 license. Please check the COPYING file for more details.
