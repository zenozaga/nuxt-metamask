import { defineNuxtPlugin, useAppConfig, useState } from '#app'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { Ref } from 'nuxt/dist/app/compat/capi'

import { get } from '../helpers'
import ProviderDetectClient from '../components/MetamaskProvider/client.vue'

interface MetaStatesType {
  connected: boolean,
  address: string|null,
  chainId: number|null,
  installed: boolean,
}

interface NuxtMetamaskOptions {
  addPlugin: boolean,
  client:boolean
}

interface MetaMaskPluginType{
  states:MetaStatesType,
  install: (origin:string, query:Object) => void,
  connect: () => Promise<string>,
  load: () => Promise<Web3|false>,
  web3: () => Web3,
 }

let initialized:boolean = false

let web3:Web3|null
const useWeb3 = () => {
  if (!initialized) { throw new Error('useWeb3 must be called in context of MetaMaskPlugin') }
  return web3
}

export default defineNuxtPlugin((nuxtApp) => {
  const _states:MetaStatesType = {
    connected: false,
    address: null,
    chainId: null,
    installed: false
  }

  const states = useState<MetaStatesType>('meta', () => _states)

  const plugin:MetaMaskPluginType = {
    states: {
      get connected () { return states.value.connected },
      get address () { return states.value.address },
      get chainId () { return states.value.chainId },
      get installed () { return states.value.installed }
    },
    async connect () {
      if (states.value.connected && states.value.address) { return states.value.address };
      const web3:Web3 = await this.load()
      return web3.eth.requestAccounts().then((accounts) => {
        states.value.connected = true
        states.value.address = accounts[0]
        return accounts[0]
      })
    },
    async install (origin, query) {

    },
    async load () {
      if (typeof window !== 'undefined') {
        if (web3) { return web3 }

        const provider = await detectEthereumProvider() as Provider
        initialized = true

        if (provider) {
          states.value.installed = true
          web3 = new Web3(provider)
        }

        return web3
      } else {
        return false
      }
    },
    web3 () { return web3 }
  }

  if (process.client) {
     plugin.load().then(web3 => plugin.connect())
  }

  nuxtApp.provide('metamask', plugin)
  nuxtApp.vueApp.component('ProviderDetect', ProviderDetectClient)
})

export {
  MetaStatesType,
  MetaMaskPluginType,
  useWeb3
}
