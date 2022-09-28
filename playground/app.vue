<template>
  <div>
    <ProviderDetect>
      <template #not-installed>
        <div class="metamask-detect-provider">
          <h1>Installed</h1>
        </div>
      </template>

      <template #installed>
        <InstalledVue />
      </template>
    </ProviderDetect>
  </div>
</template>

<script setup>
import InstalledVue from './Installed.vue'

</script>
