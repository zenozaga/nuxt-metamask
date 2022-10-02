import type { Contract } from 'web3-eth-contract/types'
import type { AbiItem } from 'web3-utils/types'
import type Web3 from 'web3/types'
import type { provider } from 'web3-core/types'

type Abis = AbiItem[]
type EthereumProvider = provider & {chainId: string, selectedAddress:string }
type onConnectCallback = (address:string) => void
type WindowEthereum = EthereumProvider & {removeListener: (type:string, callback:Function) => void, addListener: (type:string, callback:Function) => void}
type FunctionVoid = () => void
// Contracts plugin types

type onChangeCallback = (ethereum:WindowEthereum, callback: (type:string, data:any) => void) => Function
type DefineContract = (name: string, abi: AbiItem[], address: string, providerURI?:string) => Contract
type GetContract = (name: string) => Contract
type MethodcontractAsync = (name: string, method: string, args?: any[], options?: {}, cache?:boolean) => Promise<unknown>
type Methodcontract = (name: string, method: string, args?: any[], options?: {}, cache?:boolean) => unknown
type GetContractAddress = (name:string) => string

interface Cacheinstances {
  [key: string]: Contract
}

interface CacheinstancesResults {
  [key: string]: any
}

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeAllListeners(event?: string | symbol): this
}

type Provider = MetaMaskEthereumProvider & provider & EthereumProvider

interface Window {
  ethereum?: Provider
}

/**
 * @method define define contracts in the cache to use it later
 * @method get get a contract from the cache
 * @method call call a method from a contract
 * @method send send a method from a contract
 * @method address get the address of a contract
 */
interface ContratsPlugin {
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
interface MetaStatesType {
  connected: boolean,
    address: string | null,
    chainId: number | null,
    installed: boolean,
}
interface NuxtMetamaskOptions {
  addPlugin: boolean,
    client: boolean
}

interface MetaMaskPluginType {
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

export {
  Abis,
  EthereumProvider,
  onConnectCallback,
  WindowEthereum,
  FunctionVoid,
  onChangeCallback,
  DefineContract,
  GetContract,
  MethodcontractAsync,
  Methodcontract,
  GetContractAddress,
  Cacheinstances,
  CacheinstancesResults,
  MetaMaskEthereumProvider,
  Provider,
  ContratsPlugin,
  MetaStatesType,
  NuxtMetamaskOptions,
  MetaMaskPluginType,
  Web3,
  Window
}
