import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'
interface NuxtMetamaskOptions {
  addPlugin: boolean,
  client:boolean
}

export {
  NuxtMetamaskOptions
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
      const config = nuxt.options
      if (!config.vite) {
        config.vite = {}
      }

      if (!config.vite.optimizeDeps) {
        config.vite.optimizeDeps = {}
      }

      const optimizeDeps = config.vite.optimizeDeps

      if (typeof optimizeDeps.include === 'undefined') {
        optimizeDeps.include = [
          'web3'
        ]
      } else {
        optimizeDeps.include.push('web3')
      }

      // Create resolver to resolve relative paths
      const { resolve } = createResolver(import.meta.url)
      addPlugin(resolve('./runtime/plugin'))
      addComponentsDir({ path: resolve('runtime/components') })
      addImportsDir(resolve('runtime/composables'))
    }
  }
})
