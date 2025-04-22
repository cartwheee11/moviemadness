<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getGroup, editGroup, setMovieRate, getRates } from '@/api';
import type { Group, GroupMovieAddition, Movie, User, GroupMovieStatusSetting, Rate } from '../../service/types';
import ModalWindow from '@/components/ModalWindow.vue'
import { PAGE_LIMIT } from '../../constants/shared'

const route = useRoute()
const group = ref<Group>()
const movies = ref<Array<Movie & { clicked?: boolean, rates?: Rate[], stars?: number, comment?: string }>>([])
const members = ref()
const addMovieModal = ref(false)
const currentPage = ref<number>(1)
const moveisIsClear = ref<boolean>(false)
const movieListIsBlocked = ref<boolean>(false)

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

function rateMovie(id: string, comment: string | undefined, rate: number | undefined) {
  if (group.value && comment && rate) {
    setMovieRate(id, comment, rate + '', group.value.id).then(res => {
      console.log(res)
      console.log(res.data)
      if (res.data) {
        updateRates(res.data, id)
      }
    })
  }
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

function onAddMovieClick() {
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
      }
    })
  }
}

function onWatchClick(id: string) {
  if (group.value) {
    const request: GroupMovieStatusSetting = {
      groupId: group.value.id,
      aim: 'movieStatusSetting',
      movieId: id,
      watched: true
    }

    editGroup(request, currentPage.value).then(res => {
      if (res.data) {
        updateGroup(res.data)
      }
    })
  }
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

</script>

<template>
  <ModalWindow @hide="addMovieModal = false" :visible="addMovieModal">
    <h3 class="font-black text-xl pb-4">Добавить фильм</h3>
    <p><input v-model="addMovieName" class="input" type="text" placeholder="Название фильма"></p>
    <p><input v-model="addMovieComment" class="input mt-4" type="text" placeholder="Комментарий"></p>
    <p><button @click="onAddMovieClick" class="btn w-full mt-4">создать</button></p>
  </ModalWindow>
  <div class="container">
    <section class="header-section flex gap-10">
      <div class="avatar w-50" v-if="group?.avatar_url">
        <div class="ring-2 ring-offset-2 ring-base-content/10 rounded-2xl">
          <img class="" :src="group.avatar_url" alt="">
        </div>
      </div>
      <div class="avatar w-50" v-else>
        <div class="ring-2 ring-offset-2 ring-base-content/10 rounded-2xl">
          <img src="../assets/img/default-group-avatar.png" alt="">
        </div>
      </div>
      <div class="desk">

        <h1 v-if="group?.name">{{ group?.name }}</h1>
        <div class="" v-else>
          <div class="skeleton h-20 w-70"></div>
          <div class="skeleton h-10 w-50 mt-4"></div>
        </div>


        <p class="mt-4">{{ group?.desc }}</p>
      </div>
    </section>

    <section v-if="movies.length" class="">
      <h2 class="text-3xl font-black mb-5">Идеи для просмотра</h2>
      <button @click="addMovieModal = true"
        class="mb-4 btn bg-base-100 border-1 rounded-2xl border-base-content/10 w-full h-full text-4xl py-5">+</button>
      <div
        class="table-wrapper shadow-md overflow-x-auto rounded-2xl rounded-box border border-base-content/5 bg-base-100">
        <table class="table" :class="{ 'opacity-50': movieListIsBlocked }">
          <thead>
            <tr>
              <th></th>
              <th class="w-1/5">Название</th>
              <th class="w-1/5">Комментарий</th>
              <th class="w-1/5">Дата</th>
              <th class="w-1/5">Добавил</th>
              <th class="w-1/5 align-center text-center">Посмотреть</th>
            </tr>
          </thead>

          <tbody v-for="(m, i) in movies" :key="m.id">

            <tr></tr>
            <tr class="hover:bg-base-content/2 cursor-pointer group" @click="m.clicked = !m.clicked; loadRates(m)">
              <td>{{ (currentPage - 1) * PAGE_LIMIT + i + 1 }}</td>
              <th class="py-6">{{ m.name }}</th>
              <td class="max-w-50" :class="{ 'truncate': !m.clicked }">{{ m.desc }}</td>
              <td>{{ m.created_at }}</td>
              <td>{{ members?.get(m.user_id).username }}</td>
              <td class="w-50 align-center text-center">
                <button v-if="!m.is_watched" @click="onWatchClick(m.id)"
                  class="btn btn-info btn-soft group-hover:btn-info">
                  Посмотреть
                </button>

                <div v-else class="badge badge-soft badge-primary group-hover:badge-base">
                  <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square"
                        stroke-miterlimit="10" stroke-width="2"></circle>
                      <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square"
                        stroke-miterlimit="10" stroke-width="2"></polyline>
                    </g>
                  </svg>
                  Посмотрели
                </div>
              </td>
            </tr>
            <tr v-if="m.clicked && m.is_watched" class="">
              <td colspan="6" class="py-4 w-full">
                <div v-if="!m.rates" class="">
                  <span class="loading loading-dots loading-xl mx-auto"></span>
                </div>

                <div class="" v-else>
                  <div class="m-2" v-for="r in m.rates" :key="r.id">
                    <div class="message flex items-end">

                      <div class="avatar w-10 mr-4" v-if="members.get(m.user_id).avatar_url">
                        <div class="ring-2 ring-offset-2 ring-base-content/10 rounded-2xl">
                          <img class="" :src="members.get(m.user_id).avatar_url" alt="">
                        </div>
                      </div>
                      <div class="avatar w-10 mr-4" v-else>
                        <div class="ring-2 ring-offset-2 ring-base-content/10 rounded-2xl">
                          <img src="../assets/img/default-avatar.png" alt="">
                        </div>
                      </div>

                      <div class="chat chat-start">
                        <div class="chat-header">
                          <b class="ml-4"> {{ members.get(m.user_id).username }}</b>
                          <time class="text-xs opacity-50">{{ r.rate }}/10</time>
                        </div>
                        <div class="chat-bubble chat-bubble-accent">{{ r.comment }}.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex w-full gap-4">
                  <input type="text" class="input grow" v-model="m.comment" placeholder="комментарий">
                  <div class="rating rating-lg">
                    <input @click="m.stars = i" v-for="i in 10" :key="i" type="radio" name="rating-10"
                      class="mask mask-star-2 bg-primary" aria-label="1 star" />
                  </div>
                </div>
                <button @click="rateMovie(m.id, m.comment, m.stars)"
                  class="btn w-full mt-4 btn-soft btn-primary">Оценить</button>
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

</template>
