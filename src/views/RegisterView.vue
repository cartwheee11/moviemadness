<script lang="ts" setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import * as api from '../api'
import { useRouter } from 'vue-router'
const router = useRouter();

const val = ref({
  login: true,
  pass: true,
  repeatPass: true
})


const login = ref('')
const pass = ref('')
const repeatPass = ref('')
const errorMessage = ref('')
const isRegisterButtonLoading = ref(false)
const isRegisterButtonDisabled = computed(() => {
  return !val.value.login || !val.value.pass || !val.value.repeatPass || !login.value.length || !pass.value.length || !repeatPass.value.length
})

function onRegisterButtonClick() {
  isRegisterButtonLoading.value = true
  api.register(login.value, pass.value).then(data => {
    isRegisterButtonLoading.value = false
    if (data.type == 'error') {
      errorMessage.value = data.message
    } else {
      api.login(login.value, pass.value).then(() => {
        router.push('/groups')
      })
    }
  })
}
</script>

<template>

  <div class="container">
    <div class="mt-10 mx-auto max-w-100 ">


      <div class="login-form flex flex-col gap-4">
        <div class="flex justify-center">
          <div class="join">
            <RouterLink to="/auth/login"><button class="btn join-item">Войти</button></RouterLink>
            <button class="btn join-item btn-neutral">Зарегистрироваться</button>
          </div>
        </div>

        <p>
          <label class="input  w-full" :class="{ 'input-error': !val.login }" type="text">
            Логин
            <input v-model="login" class="grow" type="input" @input="() => { val.login = login.length >= 6 }"
              placeholder="вася123">
            <span v-if="!val.login" class="badge badge-error">больше 6 символов</span>
          </label>
        </p>
        <p>
          <label class="input  w-full" type="text" :class="{ 'input-error': !val.pass }">
            Пароль
            <input v-model="pass" class="grow" @input="val.pass = pass.length >= 6" type="password"
              placeholder="qwezxc">
            <span v-if="!val.pass" class="badge badge-error">больше 6 символов</span>
          </label>
        </p>
        <p>
          <label class="input  w-full" type="text" :class="{ 'input-error': !val.repeatPass }">
            Пароль
            <input class="grow" v-model="repeatPass" @input="() => { val.repeatPass = repeatPass == pass }"
              type="password" placeholder="qwezxc">
            <span v-if="!val.repeatPass" class="badge badge-error">пароли не совпадают</span>

          </label>
        </p>
        <div class="divider my-0"></div>
        <p>
          <button @click="onRegisterButtonClick" :disabled="isRegisterButtonDisabled" class="btn w-full btn-primary">
            <span v-if="isRegisterButtonLoading" class="loading loading-spinner"></span>
            <span v-else>зарегистрироваться</span>
          </button>
        </p>
      </div>
      <p class="mt-4 text-center text-primary-content">{{ errorMessage }}</p>
    </div>

  </div>

</template>
