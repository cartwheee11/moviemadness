<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { logout } from '@/api';
import AvatarWithPlaceholder from './AvatarWithPlaceholder.vue';
import { useTheme } from '@/stores/theme';
const theme = useTheme()

const router = useRouter()

const auth = useAuth()

function onLogoutClick() {
  logout().then(() => {
    router.push('/auth/login')
  })
}

function switchTheme() {
  theme.toggle()
}
</script>

<template>
  <nav class="shadow-xs">
    <div class="container flex justify-between py-4 items-center">
      <button @click="switchTheme" class='btn btn-primary'>
        <fa :icon="['fas', 'moon']" />
      </button>
      <RouterLink to="/profile">
        <b class="flex gap-2 text-lg  hide sm:show">
          <fa class="mt-1.5" :icon="['fas', 'video']" />
          <span>madness</span>
        </b>
      </RouterLink>
      <RouterLink v-if="!auth.authorized" to="/auth/login">
        <button class="btn btn-primary">
          войти
          <fa :icon="['fas', 'right-to-bracket']" />
        </button>
      </RouterLink>
      <div v-else class="flex gap-4">
        <RouterLink to="/profile" class="bg-secondary rounded-full flex gap-2 items-center pl-3">
          <fa class="text-xl text-accent" :icon="['far', 'circle-user']" />
          <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="auth.profile?.avatar">
            <span v-if="auth.authorized" class="rounded-full">{{ auth.profile?.username[0].toUpperCase() || 'А'
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
