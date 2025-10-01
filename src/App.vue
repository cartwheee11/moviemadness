<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopHeader from './components/TopHeader.vue';
import { useTheme } from './stores/theme';
const theme = useTheme()
</script>

<template>

  <div class="bg-base-200 w-full min-h-screen" :data-theme="theme.current">
    <TopHeader />
    <RouterView />
  </div>

</template>
