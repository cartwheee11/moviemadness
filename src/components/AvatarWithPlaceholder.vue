<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{ url?: string | null | undefined }>()
</script>

<template>
  <div v-if="typeof props.url === 'string' && props.url" class="avatar">
    <div class="bg-neutral text-neutral-content rounded-3xl">
      <img :src="props.url" alt="">
    </div>
  </div>
  <div v-else-if="props.url === undefined" class="skeleton"></div>
  <div v-else-if="!props.url" class="avatar avatar-placeholder">
    <div class="bg-neutral text-neutral-content rounded-3xl">
      <span class="text-xl">
        <slot></slot>
      </span>
    </div>
  </div>

</template>
