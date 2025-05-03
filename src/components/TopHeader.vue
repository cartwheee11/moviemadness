<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { logout } from '@/api';
import AvatarWithPlaceholder from './AvatarWithPlaceholder.vue';
import type { Profile } from '../../types/shared';
import { getProfile } from '@/api';
import { ref } from 'vue';

const authStore = useAuth()
const router = useRouter()
const profile = ref<Profile>()

getProfile().then(res => {
  if (res.data) {
    profile.value = res.data?.user
  }

})

function onLogoutClick() {
  logout().then(() => {
    router.push('/auth/login')
  })
}
</script>

<template>

  <nav class="shadow-xs">
    <div class="container flex justify-between py-4 items-center">
      <RouterLink to="/profile"><b>moviemadness</b></RouterLink>
      <RouterLink v-if="authStore.auth == undefined" to="/auth/login"><button class="btn">войти</button></RouterLink>

      <div v-else>
        <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="profile?.avatar || null">
          <span>{{ profile?.username[0].toUpperCase() || 'А' }}</span>
        </AvatarWithPlaceholder>
        <button @click="onLogoutClick" class="btn ml-4">выйти</button>
      </div>
    </div>
  </nav>

</template>
