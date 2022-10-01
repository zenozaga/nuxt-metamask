import type { Contract } from 'web3-eth-contract/types'
import type { AbiItem } from 'web3-utils/types'
import type Web3 from 'web3/types'
import type { provider } from 'web3-core/types'

export type Abis = AbiItem[]
export type EthereumProvider = provider & {chainId: string, selectedAddress:string }
export type onConnectCallback = (address:string) => void
export type WindowEthereum = EthereumProvider & {removeListener: (type:string, callback:Function) => void, addListener: (type:string, callback:Function) => void}
export type FunctionVoid = () => void
// Contracts plugin types

export type onChangeCallback = (ethereum:WindowEthereum, callback: (type:string, data:any) => void) => Function
export type DefineContract = (name: string, abi: AbiItem[], address: string, providerURI?:string) => Contract
export type GetContract = (name: string) => Contract
export type MethodcontractAsync = (name: string, method: string, args?: any[], options?: {}, cache?:boolean) => Promise<unknown>
export type Methodcontract = (name: string, method: string, args?: any[], options?: {}, cache?:boolean) => unknown
export type GetContractAddress = (name:string) => string

export interface Cacheinstances {
  [key: string]: Contract
}

export interface CacheinstancesResults {
  [key: string]: any
}

export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeAllListeners(event?: string | symbol): this
}

export type Provider = MetaMaskEthereumProvider & provider & EthereumProvider

export interface Window {
  ethereum?: Provider
}

/**
 * @method define define contracts in the cache to use it later
 * @method get get a contract from the cache
 * @method call call a method from a contract
 * @method send send a method from a contract
 * @method address get the address of a contract
 */
export interface ContratsPlugin {
  define: DefineContract,
  get: GetContract,
  call: MethodcontractAsync,
  send: MethodcontractAsync,
  abi:Methodcontract,
  address:GetContractAddress,
  remove: (name:string) => void
  isDefined: (name:string) => boolean
  on: (name:string, callback:Function) => void
}

// metamask lugin
export interface MetaStatesType {
  connected: boolean,
    address: string | null,
    chainId: number | null,
    installed: boolean,
}
export interface NuxtMetamaskOptions {
  addPlugin: boolean,
    client: boolean
}

export interface MetaMaskPluginType {
  states: MetaStatesType,
    install: (origin: string, query: Object) => void,
    connect: () => Promise<string>,
    load: () => Promise <Web3|false>,
    Web3: typeof Web3,
    useWeb3: () => Web3,
    account:() => Promise<string|null>
    onConnect: (callback: (address: string) => void) => void,
    onChange: (callback: (type:string, data:any) => void) => Function,
}
