<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { acceptInvite, findInvite } from '@/api';
import type { Group, ResponseBody } from '../../types/shared';
import { onMounted, ref } from 'vue';
import AvatarWithPlaceholder from '@/components/AvatarWithPlaceholder.vue';

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
  findInvite(token).then(res => {
    serverResponse.value = res
  })
})


</script>

<template>
  <div class="container mt-50">
    <br class="mt-50">

    <div v-if="!serverResponse" class="skeleton w-full h-100"></div>
    <div v-else-if="serverResponse.message === 'bad token'" class="">
      <h2 class="text-center mt-50">Неверная <br> ссылка</h2>
    </div>
    <div v-else-if="serverResponse.message = 'success'">
      <div class="card w-full bg-base-100 shadow-sm mx-auto">
        <div class="card-body">
          <div class="flex justify-between">
            <div class="group-wrapper max-w-200 flex gap-4">
              <AvatarWithPlaceholder class="w-50 h-50" :url="serverResponse.data?.avatar_url">
                <span class="text-7xl">{{ serverResponse.data?.name[0].toUpperCase() }}</span>
              </AvatarWithPlaceholder>

              <div class="info">
                <span class="badge badge-warning">приглашение</span>
                <p class="text-5xl font-black">{{ serverResponse.data?.name }}</p>
                <p class="mt-4 text-xl">{{ serverResponse.data?.desc }}</p>
              </div>

            </div>
          </div>
          <div class="mt-6">
            <button @click="onAcceptButtonClick" class="btn btn-block btn-xl">Принять</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
