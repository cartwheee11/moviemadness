import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Auth, Group, Profile } from '../../types/shared'
import { getProfile } from '@/api'
import { useRoute } from 'vue-router'

// FIXME добавить работу с api (login, register, logout) сюда
export const useAuth = defineStore('auth', () => {
  const auth = ref<Auth>()

  // TODO убрать спагетти

  const cached = localStorage.getItem('auth')
  if (cached) {
    const parsed = JSON.parse(cached) as unknown

    if (parsed && typeof parsed == 'object') {
      if ('username' in parsed) {
        if (typeof parsed.username == 'string') {
          auth.value = parsed as Auth
        }
      }
    }
  }

  const route = useRoute()
  const profile = ref<{ groups: Group[]; user: Profile }>()

  function updateProfile() {
    getProfile().then((res) => {
      if (!res.data) {
        return
      }

      const data = res.data
      profile.value = data
    })
  }

  console.log(route)

  watch(route, () => {
    console.log('update profile')
    updateProfile()
  })

  function setAuth(a: Auth) {
    console.log('получили auth: ' + a)
    auth.value = a

    console.log(auth.value)
    localStorage.setItem('auth', JSON.stringify(a))
  }

  function removeAuth() {
    auth.value = undefined
    localStorage.removeItem('auth')
  }

  return { auth, setAuth, removeAuth, profile }
})
