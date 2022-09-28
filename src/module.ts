import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin } from '@nuxt/kit'
import Web3 from 'web3'
import { assing } from './helpers'

interface NuxtMetamaskOptions {
  addPlugin: boolean,
  client:boolean
}

export default defineNuxtModule<NuxtMetamaskOptions>({
  meta: {
    name: 'nuxt-metamask',
    configKey: 'metaConfig'
  },
  defaults: {
    addPlugin: true,
    client: true
  },
  setup (options, nuxt) {
    if (options.addPlugin) {
      const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
      nuxt.options.build.transpile.push(runtimeDir)
      addPlugin({
        src: resolve(runtimeDir, 'plugin')
      })
    }
  }
})

export {
  NuxtMetamaskOptions,
  Web3
}
