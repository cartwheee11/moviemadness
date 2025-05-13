import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Profile } from '../../types/shared'
import { auth } from '@/api'
import { useRoute } from 'vue-router'

// FIXME добавить работу с api (login, register, logout) сюда
export const useAuth = defineStore('auth', () => {
  // TODO убрать спагетти
  const route = useRoute()
  const profile = ref<Profile>()
  const authorized = ref<boolean>()

  function updateProfile() {
    auth().then((res) => {
      console.log(res)
      if (!res.ok) {
        profile.value = undefined
        authorized.value = false
        return
      }

      authorized.value = true

      res.json().then((p) => {
        console.log(p)

        profile.value = p.data
      })
    })
    // getProfile()
    //   .then((res) => {
    //     if (!res.data) {
    //       return
    //     }

    //     const data = res.data
    //     profile.value = data
    //   })
    //   .catch((error) => console.log(error))
  }

  watch(route, () => {
    console.log('trying to update profile info')
    updateProfile()
  })

  return { profile, authorized }
})
