import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import type { Auth } from '../api'
export const useAuth = defineStore('auth', () => {
  const auth = ref<Auth>()

  onMounted(() => {
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

  return { auth, setAuth, removeAuth }
})
