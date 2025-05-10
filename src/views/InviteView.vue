<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { acceptInvite, findInvite } from '@/api';
import type { Group, ResponseBody } from '../../types/shared';
import { onMounted, ref } from 'vue';
import AvatarWithPlaceholder from '@/components/AvatarWithPlaceholder.vue';
import { useAuth } from '@/stores/auth';

const route = useRoute()
const router = useRouter()
const token = route.params['token'] as string

const serverResponse = ref<ResponseBody<Group>>()

function onAcceptButtonClick() {
  if (serverResponse.value?.data) {
    acceptInvite(token, serverResponse.value.data.id).then(res => {
      if (res.message == 'success') {
        router.push('/groups/' + serverResponse.value?.data?.id)
      }
    })
  }
}

onMounted(() => {
  const auth = useAuth();

  if (!auth.auth) {

  }
  findInvite(token).then(res => {
    serverResponse.value = res
  })
})


</script>

<template>
  <div class="container mt-50">
    <div v-if="!useAuth().auth" role="alert" class="alert alert-vertical sm:alert-horizontal alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>ВЫ ЕЩЕ НЕ АВТОРИЗОВАНЫ!!! Сначала авторизуйтесь, а потом уже перейдите по этой ссылке</span>
    </div>


    <div v-if="!serverResponse" class="skeleton w-full h-100 mt-4"></div>
    <div v-else-if="serverResponse.message === 'bad token'" class="mt-4">
      <h2 class="text-center mt-50">Неверная <br> ссылка</h2>
    </div>
    <div v-else-if="serverResponse.message = 'success'" class="mt-4">
      <div class="card w-full bg-base-100  mx-auto">
        <div class="card-body p-4 lg:p-7">
          <div class="flex justify-between flex-col lg:flex-row">
            <div class="group-wrapper w-full flex gap-4 flex-col lg:flex-row">
              <AvatarWithPlaceholder class="w-full lg:w-2/5 shrink-0" :url="serverResponse.data?.avatar_url">
                <span class="text-7xl">{{ serverResponse.data?.name[0].toUpperCase() || 'A' }}</span>
              </AvatarWithPlaceholder>
              <div class="info">
                <span class="badge badge-secondary">приглашение</span>
                <p class="text-5xl font-black">{{ serverResponse.data?.name }}</p>
                <p class="mt-4 text-xl">{{ serverResponse.data?.desc }}</p>
              </div>

            </div>
          </div>
          <!-- TODO: при нажатии на кнопку при условии что пользователь уже состоит в группе он ловит ошибку 500 internal server error -->
          <div class="mt-4">
            <button @click="onAcceptButtonClick" class="btn btn-block btn-primary btn-lg">Принять</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br>
</template>
