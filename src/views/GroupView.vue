<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getGroup, editGroup, setMovieRate, getRates } from '@/api';
import type { Group, GroupMovieAddition, Movie, User, GroupSettingMovieStatus, Rate, GroupMovieRemoval, GroupChangingSettings } from '../../types/shared';
import ModalWindow from '@/components/ModalWindow.vue'
import { PAGE_LIMIT } from '../../constants/shared'
import AsyncButton from '@/components/AsyncButton.vue'
import AvatarWithPlaceholder from '@/components/AvatarWithPlaceholder.vue';

const route = useRoute()
const group = ref<Group>()
const movies = ref<Array<Movie & { clicked?: boolean, rates?: Rate[], stars?: number, comment?: string }>>([])
const members = ref()
const addMovieModal = ref(false)
const currentPage = ref<number>(1)
const moveisIsClear = ref<boolean>(false)
const movieListIsBlocked = ref<boolean>(false)
const changeSettingsInputs = ref({
  name: '',
  about: '',
  avatarUrl: '' as string | null
})

const removeMovieModal = ref<boolean>(false)
const movieToRemove = ref<string>('')
const changeSettingsModal = ref<boolean>(false)

const origin = ref(window.origin)

function updateRates(rates: Rate[], movieId: string) {
  movies.value.forEach(m => {
    if (m.id === movieId) {
      console.log('условие')
      m.rates = rates
    }
  })
}

function loadRates(m: Movie & { rates?: Rate[] }) {
  if (m.is_watched) {
    getRates(m.id).then(res => {
      if (res.data) {
        m.rates = res.data
      }
    })
  }
}

function rateMovie(m: Movie & { clicked?: boolean, rates?: Rate[], stars?: number, comment?: string }) {
  return new Promise<void>((resolve, reject) => {
    console.log(m.comment, m.stars)
    if (group.value && m.comment && m.stars) {
      setMovieRate(m.id, m.comment, m.stars + '', group.value.id).then(res => {
        console.log(res)
        console.log(res.data)
        if (res.data) {
          updateRates(res.data, m.id)
          m.comment = ''
          resolve()
        } else {
          reject()
        }
      })
    } else {
      reject()
    }
  })

}

watch(movies, () => {
  console.log(movies.value)
})

watch(currentPage, () => {
  loadGroup()
})

const addMovieName = ref('')
const addMovieComment = ref('')

function updateGroup(params: { group?: Group, movies?: Movie[], members?: User[] }) {
  if (params.group) {
    group.value = params.group
  }

  if (params.movies) {
    params.movies.forEach(m => {
      m.created_at = new Date(m.created_at).toLocaleString('ru-RU').split(',')[0]
    })
    movies.value = params.movies
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
          resolve()
        }
      })
    } else {
      resolve()
    }
  })


}

function onWatchClick(id: string) {
  return new Promise<unknown>((resolve, reject) => {
    if (group.value) {
      const request: GroupSettingMovieStatus = {
        groupId: group.value.id,
        aim: 'settingMovieStatus',
        movieId: id,
        watched: true
      }

      editGroup(request, currentPage.value).then(res => {
        if (res.data) {
          updateGroup(res.data)
          resolve(true)
        }
      })
    } else {
      reject(true)
    }
  })

}

function onUnwatchClick(id: string) {
  return new Promise<unknown>((resolve, reject) => {
    if (group.value) {
      const request: GroupSettingMovieStatus = {
        groupId: group.value.id,
        aim: 'settingMovieStatus',
        movieId: id,
        watched: false
      }

      editGroup(request, currentPage.value).then(res => {
        if (res.data) {
          updateGroup(res.data)
          resolve(true)
        }
      })
    } else {
      reject(true)
    }
  })
}

function loadGroup() {
  movieListIsBlocked.value = true;
  getGroup(route.params.id as string, currentPage.value).then(res => {
    if (!res.data) {
      return
    }

    if (res.data.movies.length === 0) {
      moveisIsClear.value = true
    }

    movieListIsBlocked.value = false

    updateGroup({
      group: res.data.group,
      movies: res.data.movies,
      members: res.data.members
    })
  })
}

onMounted(() => {
  loadGroup()
})

function onRemoveMovieButtonClick() {
  return new Promise<void>((resolve) => {
    if (!group.value) {
      return resolve()
    }

    const params: GroupMovieRemoval = {
      groupId: group.value?.id,
      movieId: movieToRemove.value,
      aim: 'movieRemoval'
    }

    editGroup(params, currentPage.value).then((res) => {
      removeMovieModal.value = false
      if (!res || !res.data) {
        return resolve()
      }
      updateGroup(res.data)

      resolve()
    })
  })
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

  <ModalWindow @hide="removeMovieModal = false" :visible="removeMovieModal">
    <h3 class="font-black text-xl">Удалить фильм?</h3>
    <p class="mt-4">Это действие нельзя отменить</p>
    <AsyncButton class="btn btn-primary mt-4" @click="() => onRemoveMovieButtonClick()">
      Удалить
    </AsyncButton>
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

    <AsyncButton class="mt-4 btn w-full" @click="() => onChangeSettingsButtonClick()">Отправить</AsyncButton>
  </ModalWindow>
  <div class="container">
    <section
      class="header-section lg:items-start lg:flex-row flex-col items-center flex gap-4 lg:gap-10 py-10 lg:py-20 ">
      <AvatarWithPlaceholder class="w-20 lg:w-50 lg:h-50 h-20 text-7xl" :url="group?.avatar_url">
        <span class="text-7xl">{{ group?.name[0].toUpperCase() }}</span>
      </AvatarWithPlaceholder>
      <div class="desk lg:text-left text-center flex flex-col items-center lg:items-start">
        <h1 class=" max-w-4/5" v-if="group?.name">{{ group?.name }}</h1>
        <div class="flex flex-col items-center lg:items-start" v-else>
          <div class="skeleton h-20 w-70"></div>
          <div class="skeleton h-10 w-50 mt-4"></div>
        </div>
        <p class="mt-4">{{ group?.desc }}</p>
        <p><button @click="changeSettingsModal = true" class="btn mt-4">Настроить</button></p>
      </div>
    </section>

    <section v-if="movies.length" class="">
      <h2 class="text-3xl font-black mb-5">Идеи для просмотра</h2>
      <button @click="addMovieModal = true" class="add-table-row-button mb-4">+</button>
      <div class="table-wrapper">
        <table class="table table-lg" :class="{ 'opacity-50': movieListIsBlocked }">
          <thead>
            <tr>
              <th class="hidden lg:table-cell"></th>
              <th class="lg:w-1/6 w-full">Название</th>
              <th class="w-1/6 hidden lg:table-cell">Комментарий</th>
              <th class="w-1/6 hidden lg:table-cell">Дата</th>
              <th class="w-1/6 hidden lg:table-cell">Добавил</th>
              <th class="lg:w-1/6 align-center text-center w-0 !p-0">Статус</th>
              <th class="lg:w-1/6 align-center text-center w-0 !p-0">Удалить</th>
            </tr>
          </thead>

          <tbody v-for="(m, i) in movies" :key="m.id">
            <tr class="hover:bg-base-content/2 cursor-pointer group"
              @click.prevent="m.clicked = !m.clicked; loadRates(m)">
              <td class="hidden lg:table-cell">{{ (currentPage - 1) * PAGE_LIMIT + i + 1 }}</td>
              <th class="py-6 w-max">{{ m.name }}</th>
              <td class="max-w-50 hidden lg:table-cell" :class="{ 'truncate': !m.clicked }">{{ m.desc }}</td>
              <td class="hidden lg:table-cell">{{ m.created_at }}</td>
              <td class="hidden lg:table-cell">{{ members?.get(m.user_id).username }}</td>
              <td class="!m-0 lg:w-50 align-center text-center !p-1">
                <AsyncButton v-if="!m.is_watched" @click="() => onWatchClick(m.id)" class="btn btn-warning">
                  <span class="hidden lg:inline">Посмотреть</span>
                  <span class="lg:hidden">»</span>
                </AsyncButton>

                <div v-else class="btn btn-square lg:btn-wide btn-success btn-outline group-hover:btn-base border-1">
                  <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square"
                        stroke-miterlimit="10" stroke-width="2"></circle>
                      <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square"
                        stroke-miterlimit="10" stroke-width="2"></polyline>
                    </g>
                  </svg>
                  <span class="hidden lg:inline">Посмотрели</span>
                  <!-- <span class="lg:hidden">»</span> -->
                </div>
              </td>
              <td class="text-center delete-cell">
                <button @click.stop="movieToRemove = m.id; removeMovieModal = true"
                  class="btn btn-outline btn-square btn-error border-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                    viewBox="0 0 16 16">
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="m.clicked && m.is_watched" class="">
              <td colspan="7" class="py-4 w-full">
                <div v-if="!m.rates" class="">
                  <div class="skeleton w-full h-20 mb-4"></div>
                </div>

                <div v-else-if="m.rates.length == 0" class="p-10 pb-12 text-center">
                  <span class="font-bold">Напиши первый отзыв</span>
                </div>

                <div class="pb-4" v-else>
                  <div class="m-2 mb-4" v-for="r in m.rates" :key="r.id">
                    <div class="message flex items-end">
                      <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="members.get(m.user_id).avatar">
                        <span>{{ members.get(m.user_id).username[0].toUpperCase() }}</span>
                      </AvatarWithPlaceholder>

                      <div class="chat chat-start">
                        <div class="chat-header">
                          <b class="ml-4"> {{ members.get(r.user_id).username }}</b>
                          <time class="text-xs opacity-50">{{ r.rate }}/10</time>
                        </div>
                        <div class="chat-bubble chat-bubble-neutral text-xl">{{ r.comment }}.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex w-full gap-4 items-center flex-col lg:flex-row">
                  <input type="text" class="input input-lg grow" v-model="m.comment" placeholder="комментарий">
                  <div class="rating rating-lg">
                    <input @click="m.stars = i" v-for="i in 10" :key="i" type="radio" name="rating-10"
                      class="mask mask-star-2" aria-label="1 star" />
                  </div>
                </div>
                <AsyncButton @click="() => rateMovie(m)" class="btn btn-lg w-full mt-4 btn-success">Оценить
                </AsyncButton>
                <!-- <div class="divider"></div> -->
                <AsyncButton @click="() => onUnwatchClick(m.id)" class="mt-4 btn btn-lg w-full">
                  Не просмотрено
                </AsyncButton>
              </td>
            </tr>
          </tbody>
        </table>


      </div>

      <div class="pag flex justify-center">
        <div class="join mt-4 mx-auto">
          <button @click="currentPage = currentPage > 1 ? currentPage - 1 : currentPage"
            class="join-item btn">«</button>
          <button class="join-item btn">{{ currentPage }}</button>
          <button v-if="Number(currentPage) * PAGE_LIMIT < Number(group?.movies_count)" @click="currentPage++"
            class="join-item btn">»</button>
        </div>
      </div>
    </section>

    <div v-else-if="!moveisIsClear" class="section flex justify-center items-center h-100">
      <span class="loading loading-spinner loading-xl"></span>
    </div>

    <div v-else class="flex flex-col gap-4 justify-center items-center h-100">
      <h2>У вас пока не добавлено ни одного фильма</h2>
      <button @click="addMovieModal = true" class="btn btn-info">Добавить</button>
    </div>

  </div>
  <br>

</template>
