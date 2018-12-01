# Smart Contract Intro

This repository contains the code sample for my smart contract intro presentation at https://blockchain-freiburg.de/

## Requirements

* Node.js > 7

## Setup

1. Install truffle (https://truffleframework.com)

```
npm install -g truffle
```

2. Install Ganache (https://truffleframework.com/docs/ganache/quickstart)

3. Start Ganache with default settings
4. Copy `config.json.dist` to `config.json` and enter the values from Ganache. For the private key click on the key symbol on the right.

## Compile contracts

To compile the smart contrats run the following command

```
truffle compile
```

## Deploy to Ganache

To deploy the smart contracts to the local test network run the following command:

```
truffle migrate --network development
```

## Interact with the contract

Run the following commands to run through the functionality

```
# Add the talks
truffle exec addTalks.js

# Verify the result by listing the tasks
truffle exec getTalks.js

# Pay somthing to each talk
truffle exec pay.js

# Verify the contract is still active
truffle exec isActive.js

# Distribute the funds and disable the contract
truffle exec end.js

# Verify the contract is not active any more
truffle exec isActive.js
```

## Start over

To start clean, simply click "Restart" in Ganache.
