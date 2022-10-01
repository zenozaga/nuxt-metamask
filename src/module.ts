import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'
import Web3 from 'web3'

interface NuxtMetamaskOptions {
  addPlugin: boolean,
  client:boolean
}

export {
 Web3
}

export default defineNuxtModule<NuxtMetamaskOptions>({
  meta: {
    name: 'nuxt-metamask',
    configKey: 'metaConfig',
    compatibility: {
      nuxt: '^3.0.0-rc.3'
    }
  },
  defaults: {
    addPlugin: true,
    client: true
  },
  setup (options, nuxt) {
    if (options.addPlugin) {
      // Create resolver to resolve relative paths
      const { resolve } = createResolver(import.meta.url)
      addPlugin(resolve('./runtime/plugin'))
      addComponentsDir({ path: resolve('runtime/components') })
      addImportsDir(resolve('runtime/composables'))
    }
  }
})
