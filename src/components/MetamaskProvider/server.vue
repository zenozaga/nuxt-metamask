<template>
  <div class="metamask-detect-provider">
    <slot v-if="!isLoading && !$metamask.states.installed" name="not-installed" />
    <slot v-if="!isLoading && $metamask.states.installed" name="installed" />
    <slot v-if="isLoading" name="loading" />
    <slot v-if="!isLoading" />
  </div>
</template>

<script setup>

    // import
    import { useNuxtApp } from '#app'
    import { defineComponent, onMounted, ref } from 'vue'
    const { $metamask } = useNuxtApp()

    // define component data
    defineComponent({
        name: 'MetamaskProvider',
        props: {
            onChange: {
                type: Function,
                default: (type, data) => {}
            }
        }
    })

    const isLoading = ref(true)
    onMounted(() => {
        $metamask.load().then(() => {
            isLoading.value = false
        }).catch(() => {
            isLoading.value = false
        })
    })
</script>
