<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref<boolean>(false)

const { onClick } = defineProps<{
  onClick: () => Promise<unknown | void>
}>()

function onNativeClick() {
  console.log(onClick)
  isLoading.value = true
  const res = onClick()
  res.then(() => {
    console.log('срабатывает then')
    isLoading.value = false
  })

  res.catch(() => {
    isLoading.value = false
  })
}

</script>

<template>
  <button @click="onNativeClick">
    <slot v-if="!isLoading"></slot>
    <span v-else class="loading loading-spinner loading-xs"></span>
  </button>
</template>
