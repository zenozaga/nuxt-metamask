import { useNuxtApp } from '#app'
import type { MetaMaskPluginType } from '../types'
export const useWeb3 = () => {
    const $metamask:MetaMaskPluginType = useNuxtApp().$metamask
    if (!$metamask.useWeb3()) {
        throw new Error('useWeb3 is available on MetamaskProvider Context')
    }
    return $metamask.useWeb3()
}
