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
      errorMessage.value = data.message as string
    } else {
      api.login(login.value, pass.value).then(() => {
        router.push('/profile')
      })
    }
  })
}
</script>

<template>

  <div class="container">
    <div class="mt-7 mx-auto max-w-100 ">
      <div class="login-form flex flex-col">
        <div class="flex justify-center">
          <div class="join rounded-full overflow-hidden">
            <RouterLink to="/auth/login"><button class="btn join-item border-none bg-base-100">Войти</button>
            </RouterLink>
            <button class="btn join-item btn-primary">Зарегистрироваться</button>
          </div>
        </div>

        <div class="fieldset rounded-box p-4 mt-4 mx-auto bg-base-100 w-full lg:w-100">
          <label for="" class="label mt-4">Логин</label>
          <label class="input input-lg w-full" :class="{ 'input-error': !val.login }" type="text">
            <input v-model="login" class="input-lg w-full" type="input" @input="() => { val.login = login.length >= 6 }"
              placeholder="вася123">
            <span v-if="!val.login" class="badge badge-error">больше 6 символов</span>
          </label>

          <label for="" class="label mt-4">Пароль</label>
          <label class="input input-lg w-full" type="text" :class="{ 'input-error': !val.pass }">
            <input v-model="pass" class="w-full input-lg"
              @input="val.pass = pass.length >= 6; val.repeatPass = repeatPass == pass" type="password"
              placeholder="qwezxc">
            <span v-if="!val.pass" class="badge badge-error">больше 6 символов</span>
          </label>

          <label class="label mt-4">Повторите пароль</label>
          <label class="input-lg input w-full" type="text" :class="{ 'input-error': !val.repeatPass }">

            <input class="input-lg w-full" v-model="repeatPass" @input="() => { val.repeatPass = repeatPass == pass }"
              type="password" placeholder="qwezxc">
            <span v-if="!val.repeatPass" class="badge badge-error">пароли не совпадают</span>

          </label>

          <!-- <div class="divider"></div> -->
          <p>
            <button @click="onRegisterButtonClick" :disabled="isRegisterButtonDisabled"
              class="btn w-full btn-primary btn-lg mt-10">
              <span v-if="isRegisterButtonLoading" class="loading loading-spinner"></span>
              <span v-else>зарегистрироваться</span>
            </button>
          </p>
        </div>


      </div>
      <p class="mt-4 text-center text-primary-content">{{ errorMessage }}</p>
    </div>

  </div>

</template>
