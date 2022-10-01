import { useNuxtApp } from '#app'
import type { ContratsPlugin } from '../types'
export const useContracts: ()=>ContratsPlugin = () => {
    return useNuxtApp().$contracts
}
