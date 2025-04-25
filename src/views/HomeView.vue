<script setup lang="ts">
import AvatarWithPlaceholder from '../components/AvatarWithPlaceholder.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/profile')
</script>

<template>
  <main>
    <TopHeader />
    <AvatarWithPlaceholder placeholder="string" />
  </main>
</template>
