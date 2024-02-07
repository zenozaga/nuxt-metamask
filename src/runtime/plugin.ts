import { defineNuxtPlugin, useAppConfig, useState } from '#app'
import Web3, { validator } from 'web3'
import { detectEthereumProvider } from '@zenozaga/ethereum-ibridged'

import Contracts from './contracts'
import EthereumProviderListener from './helpers/listener'

// types
import type { MetaMaskPluginType, MetaStatesType, Window, onConnectCallback, WindowEthereum } from './types'

let web3:Web3|null

const NuxtMetamashPlugin = defineNuxtPlugin((nuxtApp) => {
  /// listener for onConnect
  let __onChangeCancel:Function = () => {}

  /// listeners for onConnect
  const __listeners:onConnectCallback[] = []

  /// try to find ethereum provider to check if metamask is installed
  /// if not found then metamask is not installed
  const ethereum:any|null = (typeof window !== 'undefined' && (window as Window).ethereum != null) ? (window as Window).ethereum : null
  const initialAddress = ethereum?.selectedAddress ?? null

  const _states:MetaStatesType = {
    installed: ethereum != null,
    connected: initialAddress != null,
    address: initialAddress,
    chainId: (ethereum?.chainId as number) ?? null
  }

  const states = useState<MetaStatesType>('metamaskStates', () => _states)

  const __setOnChange = (eth: WindowEthereum) => {
    if (__onChangeCancel) {
      __onChangeCancel()
    }
    __onChangeCancel = EthereumProviderListener(eth, (type, data) => {
      switch (`${type}`.trim()) {
        case 'accounts':{
          if ((data as string[]).length > 0) {
             states.value.address = data[0]
          } else {
              states.value.address = null
              states.value.connected = false
          }
          break
        }
        case 'connect':
        case 'chain':{
          states.value.chainId = data?.chainId ? Number(data.chainId) : Number(data)
          break
        }
        case 'disconnect':{
          states.value.connected = false
          states.value.address = null
          break
        }
      }
    })
  }
  const triggerCallbacks = () => {
    if (states.value.connected && states.value.address) {
      __listeners.forEach((callback, index) => {
        callback(states.value.address)
        __listeners.splice(index, 1)
      })
    }
  }

  // optional method to check fasty if metamask is installed and connected
  const isConnected:() => boolean = () => {
    if (typeof window !== 'undefined') {
        if (states.value.connected && states.value.address) {
          triggerCallbacks()
          return true
        }

        const w = window as Window

      if (w.ethereum != null) {
        states.value.installed = true

        if (validator.isAddress(w.ethereum.selectedAddress)) {
          web3 = new Web3(w.ethereum)
          __setOnChange(web3.currentProvider as WindowEthereum)
          states.value.chainId = Number(w.ethereum.chainId)
          states.value.address = w.ethereum.selectedAddress
          states.value.connected = true
          triggerCallbacks()
          return true
        }
      }
    }
    return false
  }

  const plugin:MetaMaskPluginType = {
    states: {
      get connected () { return states.value.connected },
      get address () { return states.value.address },
      get chainId () { return states.value.chainId },
      get installed () { return states.value.installed }
    },
    onConnect (callback:onConnectCallback) {
      if (callback && isConnected()) {
        callback(states.value.address)
      } else if (callback != null) {
        __listeners.push(callback)
      }
    },
    onChange (callback: (type:string, data:any) => void): Function|null {
       try {
        return EthereumProviderListener(web3?.currentProvider as WindowEthereum, callback)
       } catch (error) {
        globalThis?.console?.error(error)
         return null
       }
    },
    async connect () {
      if (isConnected()) { return states.value.address };
      web3 = await this.load()
      return web3?.eth.requestAccounts().then((accounts) => {
        if (accounts.length === 0) {
          return
        }

        states.value.connected = true
        states.value.address = accounts[0]
        isConnected()
        return accounts[0]
      })
    },
    async account () {
       if (isConnected()) {
        return states.value.address
       }

       if (!states.value.installed || !web3) {
          return null
       }

      return await web3.eth.getAccounts().then((accounts) => {
        if (accounts.length === 0) {
          return
        }

        states.value.connected = true
        states.value.address = accounts[0]
        isConnected()
        return accounts[0]
      })
    },
    async install (origin, query) {

    },
    async load () {
      if (typeof window !== 'undefined') {
        web3 = web3 ?? await detectEthereumProvider().then(provider => provider ? new Web3(provider) : null)
        if (web3) {
          __setOnChange(web3.currentProvider as WindowEthereum)
        }
        if (!isConnected()) {
          if (web3) {
            states.value.installed = true
            states.value.chainId = await web3.eth.getChainId().catch(() => null)
          }
        }

        return web3
      } else {
        return false
      }
    },
    get Web3 () { return Web3 },
    useWeb3 () { return web3 }
  }

  if (process.client) {
      try {
        plugin.load().then(web3 => plugin.account())
      } catch (error) { }
  }

   nuxtApp.provide('metamask', plugin)

   // insert contracts plugin
   Contracts(nuxtApp)
})

export default NuxtMetamashPlugin
