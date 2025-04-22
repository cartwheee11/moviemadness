<script lang="ts" setup>
import { createGroup, getProfile } from '@/api'
import { onMounted, ref } from 'vue'
import ModalWindow from '@/components/ModalWindow.vue'
import type { Profile } from '../../service/types'
import router from '@/router'
// import { useRouter } from 'vue-router'


const groups = ref()
const isError = ref(false)
const createGroupModal = ref(false)
const groupName = ref('')
const profile = ref<Profile>()

function onCreateGroupButtonClick() {
  createGroup(groupName.value).then((e) => {
    if (e.message != 'error') {
      window.history.go()
    }
  })
}

onMounted(() => {
  getProfile().then(data => {

    if (data.message == 'success') {
      groups.value = data.data?.groups
      profile.value = data.data?.user

      console.log(data)
    } else {
      isError.value = true
    }

  })
})

</script>

<template>
  <ModalWindow @hide="createGroupModal = false" :visible="createGroupModal">
    <p><input v-model="groupName" class="input" type="text" placeholder="Название группы"></p>
    <p><button @click="onCreateGroupButtonClick" class="btn w-full mt-4">создать</button></p>
  </ModalWindow>

  <section class="profile">
    <div class="container flex gap-10 items-center py-10">
      <div class="avatar">
        <div class="ring-base ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-3">
          <img class=" opacity-50" src="../assets/img/default-avatar.png" alt="">
        </div>
      </div>

      <div class="" v-if="!profile">
        <div class="skeleton w-70 h-15"></div>
        <div class="skeleton w-50 h-7 mt-4"></div>
      </div>
      <div v-else class="about">
        <h1 class="mb-3 text-6xl font-black">{{ profile.username }}</h1>
        <p><b>На сайте с </b>{{ new Date(profile.created_at as string).toLocaleString('ru-RU').split(',')[0] }}
        </p>
      </div>


    </div>

  </section>

  <section class="container !py-0 !pb-50">
    <h2>Мои группы</h2>
    <button @click="createGroupModal = true"
      class="mt-7 btn bg-base-100 border-1 rounded-2xl border-base-content/10 w-full h-full text-4xl py-5">+</button>

    <div v-if="!profile?.id" class="skeleton w-full h-100 mt-4"></div>
    <div
      class="mt-4 table-wrapper shadow-md overflow-x-auto rounded-2xl rounded-box border border-base-content/5 bg-base-100">
      <table class="table">
        <tbody>
          <tr v-for="(g, i) in groups" :key="g.id" class="hover:bg-base-content/5 cursor-pointer group"
            @click="router.push('/groups/' + g.id)">
            <td>
              {{ i + 1 }}
            </td>
            <th class="flex gap-5 items-center">
              <div class="avatar w-10" v-if="g.avatar_url">
                <div class="ring-2 ring-offset-2 ring-base-content/10 rounded-2xl">
                  <img class="" :src="g.avatar_url" alt="">
                </div>
              </div>
              <div class="" v-else>
                <div class="ring-2 w-10 rounded-2xl ring-base-content/10 ">
                  <img src="../assets/img/default-group-avatar.png" alt="">
                </div>
              </div>
              {{ g.name }}
            </th>
            <td class="truncate">{{ g.desc }}</td>
            <td>{{ new Date(g.created_at as string).toLocaleString('ru-RU').split(',')[0] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
