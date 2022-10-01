/* eslint-disable n/no-callback-literal */
import type { Eth } from 'web3-eth/types'
import type { onChangeCallback, WindowEthereum } from '../types'

type onCallback = (type:string, data:unknown) => void

const EthereumProviderListener:onChangeCallback = (ethereum: WindowEthereum, callback:onCallback) => {
    if (typeof window === 'undefined') {
        throw new TypeError('onChange can only be used on the client side')
    }

    if (!ethereum) {
        throw new TypeError('onChange requires an ethereum provider')
    }

    const Listener = (accounts:string[]) => { callback('accounts', accounts) }
    const ListenerChain = (chainId:string) => callback('chain', chainId)
    const ListenerConnect = (ConnectInfo:any) => callback('connect', ConnectInfo)
    const ListenerDisconnect = (ProviderRpcError:string) => callback('disconnect', ProviderRpcError)
    const ListenerMessage = (ProviderMessage:string) => callback('message', ProviderMessage)

    const Cancel = () => {
        ethereum.removeListener('accountsChanged', Listener)
        ethereum.removeListener('chainChanged', ListenerChain)
        ethereum.removeListener('connect', ListenerConnect)
        ethereum.removeListener('disconnect', ListenerDisconnect)
        ethereum.removeListener('message', ListenerMessage)
    }

    ethereum.addListener('accountsChanged', Listener)
    ethereum.addListener('chainChanged', ListenerChain)
    ethereum.addListener('connect', ListenerConnect)
    ethereum.addListener('disconnect', ListenerDisconnect)
    ethereum.addListener('message', ListenerMessage)

    return Cancel
}

export default EthereumProviderListener
