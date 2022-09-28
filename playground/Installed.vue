<template>
  <div>
    <h1>Metamask is installed</h1>
    <p v-if="$metamask.states.connected">Address: {{$metamask.states.address}}</p>
    <button :disabled="$metamask.states.connected" @click="$metamask.connect()">
      Connect
    </button>
  </div>
</template>

<script setup>
    import { useNuxtApp, useState } from '#app'
    import { onMounted } from 'vue'
    const { $metamask } = useNuxtApp()

</script>
