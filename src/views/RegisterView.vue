<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import * as api from '../api'
import { useRouter } from 'vue-router'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import shared from '../../schemas/shared/register'

const router = useRouter();

const schema = toTypedSchema(shared)


const { errors, meta, validate, handleSubmit } = useForm({
  validationSchema: schema
})

const isRegisterButtonLoading = ref(false)

const onSubmit = handleSubmit((fields) => {
  isRegisterButtonLoading.value = true

  api.register(fields.username, fields.pass).then(data => {
    isRegisterButtonLoading.value = false
    if (data.type == 'error') {
      validate()
    } else {
      api.login(fields.username, fields.pass).then(() => {
        router.push('/profile')
      })
    }
  })
}, () => {
  validate()
})
</script>

<template>

  <div class="container">

    <div class="mt-7 mx-auto max-w-100 ">
      <form class="login-form flex flex-col" @submit.prevent="onSubmit">
        <div class="flex justify-center">
          <div class="join rounded-full overflow-hidden">
            <RouterLink to="/auth/login"><button class="btn join-item border-none bg-base-100">Войти</button>
            </RouterLink>
            <button class="btn join-item btn-primary">Зарегистрироваться</button>
          </div>
        </div>
        <div class="fieldset rounded-box p-4 mt-4 mx-auto bg-base-100 w-full lg:w-100">
          <label for="" class="label mt-4">Логин</label>
          <label class="input input-lg w-full" :class="{ 'input-error': errors.username }" type="text">
            <Field class="input-lg w-full" name="username" :rules="{ required: false }" />
          </label>
          <ErrorMessage class="badge badge-error" name="username" />
          <label for="" class="label mt-4">Пароль</label>
          <label class="input input-lg w-full" type="text" :class="{ 'input-error': errors.pass }">
            <Field type="password" class="input-lg w-full" name="pass" />
          </label>
          <ErrorMessage class="badge badge-error" name="pass" />
          <label class="label mt-4">Повторите пароль</label>
          <label class="input-lg input w-full" type="text" :class="{ 'input-error': errors.confirmPass }">
            <Field type="password" class="input-lg w-full" name="confirmPass" />
          </label>
          <ErrorMessage class="badge badge-error" name="confirmPass" />
          <p>
            <button :disabled="!meta.touched" class="btn w-full btn-primary btn-lg mt-10">
              <span v-if="isRegisterButtonLoading" class="loading loading-spinner"></span>
              <span v-else>зарегистрироваться</span>
            </button>
          </p>
        </div>


      </form>
    </div>

  </div>

</template>
