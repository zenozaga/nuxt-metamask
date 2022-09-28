import { defineNuxtConfig } from 'nuxt/config'
import NuxtMetamask from '..'

export default defineNuxtConfig({
  modules: [
    NuxtMetamask
  ],
  metaConfig: {
    addPlugin: true
  }
})
