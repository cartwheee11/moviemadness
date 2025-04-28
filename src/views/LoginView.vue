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

      <RouterLink to="/auth/register"><button class="btn">Зарегистрироваться</button> </RouterLink>

    </div>
    <fieldset class="fieldset rounded-box p-4 mt-4 mx-auto border-base-200 border-2 w-full lg:w-100">
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

    <!-- <div class="mt-10 mx-auto max-w-100 ">
      <div class="login-form flex flex-col gap-4">
        <div class="flex justify-center">
          <div class="join overflow-hidden">
            <button class="btn join-item btn-primary">Войти</button>
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
    </div> -->

  </div>

</template>
