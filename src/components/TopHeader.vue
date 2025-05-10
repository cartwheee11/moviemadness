<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { logout } from '@/api';
import AvatarWithPlaceholder from './AvatarWithPlaceholder.vue';

const authStore = useAuth()
const router = useRouter()
// const profile = ref<Profile>()

const auth = useAuth()
// const profile = auth.profile

if (useAuth().auth) {

  // getProfile().then(res => {
  //   if (res.data) {
  //     profile.value = res.data?.user
  //   }
  // })
}


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
      <RouterLink v-if="authStore.auth == undefined" to="/auth/login"><button class="btn btn-primary">войти</button>
      </RouterLink>

      <div v-else class="flex gap-4">
        <RouterLink to="/profile">
          <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="auth.profile?.user.avatar">
            <span v-if="auth.profile" class="rounded-full">{{ auth.profile?.user.username[0].toUpperCase() || 'А'
              }}</span>
            <span v-else class="rounded-full">
              <div class="loading loading-spinner"></div>
            </span>
          </AvatarWithPlaceholder>
        </RouterLink>

        <button @click="onLogoutClick" class="btn btn-primary">выйти</button>
      </div>
    </div>
  </nav>

</template>
