<script lang="ts" setup>
import { computed, ref } from 'vue';
import * as api from '../api'
import { useRouter } from 'vue-router';
const login = ref('')
const pass = ref('')
const errorMessage = ref('')
const isLoginButtonLoading = ref(false)
const router = useRouter()

const val = ref({
  login: true,
  pass: true
})

const isLoginButtonDisabled = computed(() => {
  return !pass.value.length || !login.value.length || !val.value.login || !val.value.pass
})


function onLoginClick() {
  isLoginButtonLoading.value = true

  const loginResult = api.login(login.value, pass.value)

  loginResult.then(ans => {
    isLoginButtonLoading.value = false
    if (ans.message == 'error') {
      errorMessage.value = ans.message
      val.value.login = false
      val.value.pass = false
    } else {
      router.push('/profile')
    }
  })

  console.log(window.origin)
}
</script>

<template>

  <div class="container">
    <div class="mt-10 mx-auto max-w-100 ">
      <div class="login-form flex flex-col gap-4">
        <div class="flex justify-center">
          <div class="join overflow-hidden">
            <button class="btn join-item btn-neutral">Войти</button>
            <RouterLink to="/auth/register"><button class="btn join-item">Зарегистрироваться</button></RouterLink>
          </div>
        </div>

        <p>
          <label class="input w-full" type="text" :class="{ 'input-error': !val.login }">
            Логин
            <input class="grow" @input="val.login = true" v-model="login" type="input" placeholder="вася123">
          </label>
        </p>
        <p>
          <label class="input  w-full" type="text" :class="{ 'input-error': !val.pass }">
            Пароль
            <input class="grow" @input="val.pass = true" v-model="pass" type="password" placeholder="qwezxc">
          </label>
        </p>
        <div class="divider my-0"></div>
        <p>
          <button :disabled="isLoginButtonDisabled" @click="onLoginClick" class="btn  w-full btn-primary">
            <span v-if="isLoginButtonLoading" class="loading loading-spinner"></span>
            <span v-else>войти</span>
          </button>
        </p>
      </div>
      <p class="text-primary mt-4 text-center">{{ errorMessage }}</p>
    </div>

  </div>

</template>
