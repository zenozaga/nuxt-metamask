<template>
  <div>
    <div v-if="!$metamask.states.installed">
      <h3>Metamask is not installed</h3>
      <p>Install Metamask to use this app</p>
    </div>

    <div v-if="$metamask.states.installed">
      <h3>Metamask is already installed</h3>
      <p>Network Chain ID: {{ $metamask.states.chainId }}</p>
      <p v-if="$metamask.states.connected">
        Wallet: {{ $metamask.states.address }}
      </p>
      <button
        :disabled="$metamask.states.connected"
        @click="$metamask.connect()"
      >
        Connect your Wallet
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, useMetamask } from './.nuxt/imports'

// metamask plugin
const $metamask = useMetamask()

onMounted(() => {
  window.$metamask = $metamask
})

</script>
