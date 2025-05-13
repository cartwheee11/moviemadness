<script setup lang="ts">
import { onMounted, ref, watch, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getGroup, editGroup, removeGroup } from '@/api';
import type { Group, GroupMovieAddition, User, GroupChangingSettings } from '../../types/shared';
import ModalWindow from '@/components/ModalWindow.vue'
import { PAGE_LIMIT } from '../../constants/shared'
import AsyncButton from '@/components/AsyncButton.vue'
import AvatarWithPlaceholder from '@/components/AvatarWithPlaceholder.vue';
import MoviesPage from '@/components/MoviesPage.vue';
import type { ComponentExposed } from 'vue-component-type-helpers'

const route = useRoute()
const router = useRouter()
const group = ref<Group>()
const members = ref<Map<string, User>>()
const addMovieModal = ref(false)
const currentPage = ref<number>(1)
const moviesIsClear = ref<boolean>(false)
const changeSettingsInputs = ref({
  name: '',
  about: '',
  avatarUrl: '' as string | null
})

const moviesPage = useTemplateRef<ComponentExposed<typeof MoviesPage>>('moviesPage')
const changeSettingsModal = ref<boolean>(false)
const origin = ref(window.origin)


watch(currentPage, () => {
  loadGroup()
})

const addMovieName = ref('')
const addMovieComment = ref('')

function updateGroup(params: { group?: Group, members?: User[] }) {
  if (params.group) {
    group.value = params.group
  }

  if (params.members) {
    members.value = new Map(params.members.map((user) => [user.id, user]))
  }
}

watch(group, () => {
  if (group.value) {
    changeSettingsInputs.value.about = group.value.desc
    changeSettingsInputs.value.avatarUrl = group.value.avatar_url
    changeSettingsInputs.value.name = group.value.name
  }
})

function onAddMovieClick() {
  return new Promise<void>((resolve) => {
    if (group.value) {
      const request: GroupMovieAddition = {
        groupId: group.value.id,
        aim: "movieAddition",
        movieName: addMovieName.value,
        movieDesc: addMovieComment.value
      }

      editGroup(request, currentPage.value).then((res) => {
        if (res.data) {
          updateGroup(res.data)
          addMovieModal.value = false
          addMovieName.value = ''
          addMovieComment.value = ''

          moviesPage.value?.loadPage()
          resolve()
        }
      })
    } else {
      resolve()
    }
  })
}

function loadGroup() {
  getGroup(route.params.id as string, currentPage.value).then(res => {
    if (!res.data) {
      return
    }

    if (res.data.movies.length === 0) {
      moviesIsClear.value = true
    }

    updateGroup({
      group: res.data.group,
      members: res.data.members
    })
  })
}

const removeGroupModal = ref({
  visible: false,
  text: ''
})

onMounted(() => {
  loadGroup()
})

function onRemoveGroupClick() {
  if (group.value) {
    removeGroup(group.value.id).then(res => {
      if (res.message !== 'success') {
        removeGroupModal.value.text = 'Вы не являетесь создателем группы'
        removeGroupModal.value.visible = true
        return
      }

      router.push('/profile')
    })
  }
}

function onChangeSettingsButtonClick() {
  return new Promise<void>(resolve => {
    if (!group.value) {
      return
    }
    const { name, about, avatarUrl } = changeSettingsInputs.value
    const params: GroupChangingSettings = {
      name, about, avatarUrl, aim: 'changingSettings', groupId: group.value.id
    }

    editGroup(params, currentPage.value).then(res => {
      if (res.data) {
        updateGroup(res.data)
        changeSettingsModal.value = false
        resolve()
      } else {
        changeSettingsModal.value = false
        resolve()
      }
    })
  })
}
</script>

<template>
  <ModalWindow :visible="removeGroupModal.visible" @hide="removeGroupModal.visible = false">
    <h3 class="text-xl font-bold">{{ removeGroupModal.text }}</h3>
    <br>
    <button class="btn" @click="onRemoveGroupClick">Удалить</button>
  </ModalWindow>

  <ModalWindow @hide="addMovieModal = false" :visible="addMovieModal">
    <h3 class="font-black text-xl pb-4">Добавить фильм</h3>
    <p><input v-model="addMovieName" class="input" type="text" placeholder="Название фильма"></p>
    <p><input v-model="addMovieComment" class="input mt-4" type="text" placeholder="Комментарий"></p>
    <p>
      <AsyncButton @click="() => onAddMovieClick()" class="btn w-full mt-4">
        <span>
          Создать
        </span>
      </AsyncButton>
    </p>
  </ModalWindow>

  <ModalWindow @hide="changeSettingsModal = false" :visible="changeSettingsModal">
    <h3 class="font-black text-xl">Настройте группу</h3>

    <fieldset class="fieldset w-full text-left mt-2">
      <legend class="fieldset-legend">Имя группы</legend>
      <input type="text" v-model="changeSettingsInputs.name" class="input w-full">
    </fieldset>

    <fieldset class="fieldset w-full text-left mt-2">
      <legend class="fieldset-legend">Описание</legend>
      <input type="text" v-model="changeSettingsInputs.about" class="input w-full" placeholder="Описание">
    </fieldset>

    <fieldset class="fieldset w-full text-left mt-2">
      <legend class="fieldset-legend">Ссылка на аватарку</legend>
      <input type="text" v-model="changeSettingsInputs.avatarUrl" class="input w-full" placeholder="Ссылка на картинку">
    </fieldset>

    <fieldset class="fieldset w-full text-left mt-2">
      <legend class="fieldset-legend">Ссылка-приглашение</legend>
      <textarea rows="4" v-if="group" type="text" :value="`${origin}/invite/${group.invite_token}`"
        class="textarea w-full" placeholder="Type here"></textarea>
      <div v-else class="skeleton w-full h-10"></div>
    </fieldset>

    <button class="btn btn-error w-full mt-4" @click="
      removeGroupModal.visible = true;
    changeSettingsModal = false
    removeGroupModal.text = 'Вы действительно хотите удалить группу? Это действие нельзя отменить'
      ">удалить группу</button>

    <AsyncButton class="mt-4 btn w-full" @click="() => onChangeSettingsButtonClick()">Отправить</AsyncButton>
  </ModalWindow>
  <div class="container">
    <section
      class="header-section lg:items-start lg:flex-row flex-col items-center flex gap-4 lg:gap-10 py-10 lg:py-20 w-full max-w-full">
      <div class="flex flex-col items-center">
        <AvatarWithPlaceholder class="w-20 lg:w-50 lg:h-50 h-20 text-7xl" :url="group?.avatar_url">
          <span class="text-7xl">{{ group?.name[0].toUpperCase() }}</span>
        </AvatarWithPlaceholder>
        <button @click="changeSettingsModal = true" class="btn btn-info mt-4 w-full hide lg:show lg:visible">
          <fa :icon="['fas', 'gear']" />
          Настроить
        </button>
      </div>

      <div class="lg:text-left grow text-center flex flex-col items-center lg:items-start">
        <h1 class="wrap-anywhere" v-if="group?.name">{{ group?.name }}</h1>
        <div class="flex flex-col items-center lg:items-start" v-else>
          <div class="skeleton h-20 w-70"></div>
          <div class="skeleton h-10 w-50 mt-4"></div>
        </div>
        <p class="mt-4">{{ group?.desc }}</p>
        <p><button @click="changeSettingsModal = true" class="btn btn-info mt-4 lg:absolute lg:hide">
            <fa :icon="['fas', 'gear']" />
            Настроить
          </button>
        </p>
      </div>
    </section>

    <h2 class="text-3xl font-black mb-5">Идеи для просмотра</h2>
    <button @click="addMovieModal = true" class="add-table-row-button mb-4">+</button>
    <MoviesPage ref="moviesPage" :currentPage="currentPage" />

    <div class="pag flex justify-center">
      <div class="join mx-auto">
        <button @click="currentPage = currentPage > 1 ? currentPage - 1 : currentPage"
          class="join-item btn btn-info">«</button>
        <button class="join-item btn btn-info">{{ currentPage }}</button>
        <button v-if="Number(currentPage) * PAGE_LIMIT < Number(group?.movies_count)" @click="currentPage++"
          class="join-item btn btn-info">»</button>
      </div>
    </div>
  </div>
  <br>

</template>
