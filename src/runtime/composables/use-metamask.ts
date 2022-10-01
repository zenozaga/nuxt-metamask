import { useNuxtApp } from '#app'
import type { MetaMaskPluginType } from '../types'
export const useMetamask: ()=> MetaMaskPluginType = () => {
    const { $metamask } = useNuxtApp()
    return $metamask
}
