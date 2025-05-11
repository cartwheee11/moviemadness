<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { logout } from '@/api';
import AvatarWithPlaceholder from './AvatarWithPlaceholder.vue';

const authStore = useAuth()
const router = useRouter()

const auth = useAuth()

function onLogoutClick() {
  logout().then(() => {
    router.push('/auth/login')
  })
}
</script>

<template>
  <nav class="shadow-xs">
    <div class="container flex justify-between py-4 items-center">
      <RouterLink to="/profile">
        <b class="flex gap-2 text-lg">
          <fa class="mt-1.5" :icon="['fas', 'video']" />madness
        </b>
      </RouterLink>
      <RouterLink v-if="authStore.auth == undefined" to="/auth/login">
        <button class="btn btn-primary">
          войти
          <fa :icon="['fas', 'right-to-bracket']" />
        </button>
      </RouterLink>

      <div v-else class="flex gap-4">
        <RouterLink to="/profile" class="bg-secondary rounded-full flex gap-2 items-center pl-3">
          <fa class="text-xl text-accent" :icon="['far', 'circle-user']" />
          <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="auth.profile?.user.avatar">
            <span v-if="auth.profile" class="rounded-full">{{ auth.profile?.user.username[0].toUpperCase() || 'А'
            }}</span>
            <span v-else class="rounded-full">
              <div class="loading loading-spinner"></div>
            </span>
          </AvatarWithPlaceholder>
        </RouterLink>

        <button @click="onLogoutClick" class="btn btn-primary">
          выйти
          <fa :icon="['fas', 'right-from-bracket']" />
        </button>
      </div>
    </div>
  </nav>

</template>
