<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { logout } from '@/api';

const authStore = useAuth()
const router = useRouter()

function onLogoutClick() {
  logout().then(() => {
    router.push('/auth/login')
  })
}
</script>

<template>
  <div class="container">
    <nav class="shadow-xs navbar flex justify-between py-4 items-center">
      <RouterLink to="/profile"><b>moviemadness</b></RouterLink>
      <RouterLink v-if="authStore.auth == undefined" to="/auth/login"><button class="btn">войти</button></RouterLink>

      <div v-else>
        {{ authStore.auth?.username }}
        <button @click="onLogoutClick" class="btn ml-4">выйти</button>
      </div>
    </nav>
  </div>
</template>
