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
    if (ans.message !== 'success') {
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

  <div class="container flex items-center flex-col">
    <div class="join overflow-hidden rounded-full mt-7">
      <button class="btn join-item btn-primary">Войти</button>

      <RouterLink to="/auth/register"><button class="btn bg-base-100 border-none">Зарегистрироваться</button>
      </RouterLink>

    </div>
    <fieldset class="fieldset rounded-box p-4 bg-base-100 mt-4 mx-auto w-full lg:w-100">
      <label class="label mt-4">Логин</label>
      <input type="text" @input="val.pass = true; val.login = true" v-model="login"
        :class="{ 'input-error': !val.login }" class="input input-lg w-full" placeholder="Логин" />

      <label class="label mt-4">Пароль</label>
      <input @input="val.login = true; val.pass = true" v-model="pass" type="password"
        :class="{ 'input-error': !val.pass }" class="input input-lg w-full" placeholder="Пароль" />

      <div class="divider"></div>

      <button :disabled="isLoginButtonDisabled" @click="onLoginClick" class="btn btn-lg w-full btn-primary">
        <span v-if="isLoginButtonLoading" class="loading loading-spinner"></span>
        <span v-else>войти</span>
      </button>
    </fieldset>
  </div>

</template>
