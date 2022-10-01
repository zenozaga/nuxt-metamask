<template>
  <div>
    <h1>Metamask is installed w</h1>
    <p v-if="$metamask.states.connected">Address: {{$metamask.states}}</p>
    <button :disabled="$metamask.states.connected" @click="$metamask.connect()">
      Connect
    </button>
  </div>
</template>

<script setup>
    import { useNuxtApp } from '#app'
    import { onMounted } from 'vue'
    import { useMetamask } from './.nuxt/imports'
    const { $metamask, $contracts } = useNuxtApp()

    onMounted(() => {
      window.$contracts = $contracts
      window.$metamask = useMetamask()
    })

</script>
