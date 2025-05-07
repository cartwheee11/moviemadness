<script lang="ts" setup>
import { createGroup, editProfile, getProfile } from '@/api'
import { onMounted, ref, watch } from 'vue'
import ModalWindow from '@/components/ModalWindow.vue'
import type { Profile } from '../../types/shared'
import router from '@/router'
import AvatarWithPlaceholder from '../components/AvatarWithPlaceholder.vue'
import AsyncButton from '@/components/AsyncButton.vue'
import { useAuth } from '@/stores/auth'

const groups = ref()
const isError = ref(false)
const createGroupModal = ref(false)
const groupName = ref('')
const profile = ref<Profile>()
const editProfileModal = ref<boolean>(false)
const editProfileInputs = ref({
  username: '',
  avatar: ''
})

watch(profile, () => {
  editProfileInputs.value = {
    username: profile.value?.username || '',
    avatar: profile.value?.avatar || ''
  }
})

function updateProfile(user: Profile) {
  profile.value = user
}

function onEditProfileButtonClick() {
  return new Promise<void>((resolve) => {
    editProfile({ name: editProfileInputs.value.username, avatar: editProfileInputs.value.avatar }).then(res => {
      if (res.data) {
        const { username, avatar, created_at, id } = res.data
        updateProfile({ username, avatar, id, created_at })

      }
      resolve()
      editProfileModal.value = false
    })
  })
}

function onCreateGroupButtonClick(): Promise<void> {
  return new Promise<void>((resolve => {
    createGroup(groupName.value).then((e) => {
      if (e.message == 'success') {
        window.history.go()

        createGroupModal.value = false
        groupName.value = ''
        resolve()
      } else {
        resolve()
      }
    })
  }))
}

onMounted(() => {
  getProfile().then(data => {
    if (data.message == 'success') {
      groups.value = data.data?.groups
      profile.value = data.data?.user


      //TODO пофиксить
      const auth = useAuth()
      auth.setAuth({ username: data.data?.user.username as string })
    } else {
      isError.value = true
    }

  })
})
</script>

<template>
  <ModalWindow @hide="createGroupModal = false" :visible="createGroupModal">
    <p><input v-model="groupName" class="input" type="text" placeholder="Название группы"></p>
    <p>
      <AsyncButton @click="() => onCreateGroupButtonClick()" class="btn w-full mt-4">создать</AsyncButton>
    </p>
  </ModalWindow>

  <ModalWindow @hide="editProfileModal = false" :visible="editProfileModal">
    <h3 class="font-black text-xl">Настройки профиля</h3>

    <fieldset class="fieldset w-full text-left mt-2">
      <legend class="fieldset-legend">Никнейм</legend>
      <input type="text" v-model="editProfileInputs.username" class="input w-full">
    </fieldset>

    <fieldset class="fieldset w-full text-left mt-2">
      <legend class="fieldset-legend">Ссылка на аватарку</legend>
      <input type="text" v-model="editProfileInputs.avatar" class="input w-full" placeholder="Описание">
    </fieldset>

    <AsyncButton class="mt-4 btn w-full" @click="() => onEditProfileButtonClick()">Отправить</AsyncButton>
  </ModalWindow>


  <section class="profile">
    <div class="container flex gap-4 lg:gap-10 items-center py-20">

      <AvatarWithPlaceholder :url="profile?.avatar" class="w-20 h-20 shrink-0 lg:w-40 lg:h-40 text-7xl">
        <span class="lg:text-7xl">{{ profile?.username[0].toUpperCase() }}</span>
      </AvatarWithPlaceholder>


      <div class="grow" v-if="!profile">
        <div class="skeleton w-full h-15"></div>
        <div class="skeleton w-50 h-7 mt-4"></div>
      </div>
      <div v-else class="about">
        <h1 class="mb-3 font-black truncate max-w-50 md:max-w-full">{{ profile.username }}</h1>
        <p>
          <b>На сайте с </b>{{ new Date(profile.created_at as string).toLocaleString('ru-RU').split(',')[0] }}
        </p>
        <button @click="editProfileModal = true" class="btn mt-4">Редактировать</button>
      </div>


    </div>

  </section>

  <section class="container !py-0 !pb-50">
    <h2>Мои группы</h2>
    <button @click="createGroupModal = true" class="add-table-row-button mt-4">+</button>

    <div v-if="!profile?.id" class="skeleton w-full h-100 mt-4"></div>
    <div class="mt-4 table-wrapper">
      <table class="table table-lg">
        <tbody class="">
          <tr v-for="(g, i) in groups" :key="g.id" class="hover:bg-base-content/2 cursor-pointer group"
            @click="router.push('/groups/' + g.id)">
            <td class="w-1">
              {{ i + 1 }}
            </td>
            <th class="flex gap-5 items-center ">
              <AvatarWithPlaceholder class="w-10 h-10" :url="g?.avatar_url">{{ g.name[0] }}</AvatarWithPlaceholder>
              <span class="truncate max-w-45">{{ g.name }}</span>
            </th>
            <td class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell truncate max-w-50">{{ g.desc }}</td>
            <td class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell ">{{ new Date(g.created_at as
              string).toLocaleString('ru-RU').split(',')[0]
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
