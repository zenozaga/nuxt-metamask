<template>
  <div class="metamask-detect-provider">
    <slot v-if="!isLoading && !$metamask.states.installed" name="not-installed" />
    <slot v-if="!isLoading && $metamask.states.installed" name="installed" />
    <slot v-if="isLoading" name="loading" />
    <ClientOnly v-if="client">
      <slot v-if="!isLoading" />
    </ClientOnly>
    <slot v-if="!isLoading && !client" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMetamask } from '../../composables/use-metamask'

const isLoading = ref(true)
const $metamask = useMetamask()

defineProps({
    client: {
        type: Boolean,
        default: true
    }
})

onMounted(() => {
    $metamask.load().then(() => {
        isLoading.value = false
    }).catch(() => {
        isLoading.value = false
    })
})

</script>
