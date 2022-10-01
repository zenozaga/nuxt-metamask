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

<script lang="ts">
import { defineNuxtComponent } from '#app'
export default defineNuxtComponent({
    props: {
        client: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            isLoading: true
        }
    },
    mounted () {
        const $this = this
        this.$metamask.load().then(() => {
            $this.isLoading = false
        }).catch(() => {
            $this.isLoading = false
        })
    }
})

</script>
