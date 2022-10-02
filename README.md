Hello! I'm not very expert in creating modules, but I hope it can help someone 🧡🧡🧡

# nuxt-metamask

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]

> Metamask support for `nuxt 3` project with Web3

## Installation

```bash
# using npm
npm install nuxt-metamask

# or yarn
yarn add nuxt-metamask
```

## Setup


&nbsp;1. Add `nuxt-metamask` dependency to your project

```js
{
  modules: [
    // Simple usage
    'nuxt-metamask'
  ]
  
}
```

## Usage

&nbsp; 1. Use Component `MetamaskProvider` 
- Example using component `MetamaskProvider`  in App.vue
```vue
<template>
  <MetamaskProvider>

      <!-- only if is not installed -->
      <template #not-installed>
          <h1>is not installed</h1>
      </template>

      <!-- only if is installed -->
      <template #installed>
          <h1>installed</h1>
      </template>

      <!-- default -->
      <h1>default slot</h1>
  
  </MetamaskProvider>
</template>

 

```

## States

&nbsp; 2. using states in template
- Metamask states
```js
// get $metamask using `useNuxtapp`
const { $metamask } = useNuxtapp();

//states of $metamask.states
/*
{
  connected: boolean,
  address: string,
  chainId: number,
  installed: boolean,
}
*/

```
- Example using states in template
```vue

<template>
  <div>

    <!-- show if not installed -->
    <div v-if="!$metamask.states.installed">
      <h3>Metamask is not installed</h3>
      <p>Install Metamask to use this app</p>
    </div>

    <!-- show if installed -->
    <div v-if="$metamask.states.installed">
      
      <h3>Metamask is already installed</h3>
      <p>Network Chain ID: {{ $metamask.states.chainId }}</p>


      <!-- show if connected -->
      <p v-if="$metamask.states.connected">
        Wallet: {{ $metamask.states.address }}
      </p>

      <!-- click to connect your wallet -->
      <button
        :disabled="$metamask.states.connected"
        @click="$metamask.connect()"
      >
        Connect your Wallet
      </button>
      
    </div>
  </div>
</template>

<script setup>

  //metamask plugin
  const $metamask = useMetamask();

</script>


```

&nbsp; 3. Use `$contracts` methods
- Define a contract and use later
```js

  // using composable 'useContracts'
  const $contracts = useContracts()

  //or
  // const $metamask = useMetamask();

  // abi example to get only the name
  const exampleAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
  ]
  

  // define BUSD contract using Metamask provider - Smart Chain Testnet
  // using window.ethereum provider by default
  $contracts.define(
    "busd", 
    exampleAbi, 
    "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7"
  )

  // or connect directly to  Smart Chain Testnet
  $contracts.define(
    "busd", 
    exampleAbi, 
    "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7", 
    "https://data-seed-prebsc-1-s3.binance.org:8545" // custom rpc url
  )



```
- executes the contract methods already defined
```js

  // get $contracts & $metamask web3 instance
  const { $contracts, $metamask } = useNuxtApp()


  // call - get name of BUSD contract
  $contracts.call("busd", "name").then(console.log) // BUSD Token

  // or use
  $contracts.get("busd").methods.name().call().then(console.log)// BUSD Token


  // send - transfer token to another address
  $contracts.send(
    "busd", 
    "transfer", 
    [
      "0x0000000000000000000000000000000000000000", // address to send tokens
      $metamask.Web3.utils.toWei("10") //amount
    ], 
    {
      from: $metamask.states.address
    }
  ).then(console.log) 


  // get method encode by `encodeABI`
  $contracts.abi(
    "busd", 
    "name"
  )


```

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-metamask/latest.svg?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/nuxt-metamask

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-metamask.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-metamask


[license-src]: https://img.shields.io/npm/l/nuxt-metamask.svg?style=flat-square
[license-href]: https://npmjs.com/package/nuxt-metamask