<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getGroup, editGroup, setMovieRate, getRates, removeRate } from '@/api';
import type { Group, GroupMovieAddition, Movie, User, GroupSettingMovieStatus, Rate, GroupMovieRemoval, GroupChangingSettings } from '../../types/shared';
import ModalWindow from '@/components/ModalWindow.vue'
import { PAGE_LIMIT } from '../../constants/shared'
import AsyncButton from '@/components/AsyncButton.vue'
import AvatarWithPlaceholder from '@/components/AvatarWithPlaceholder.vue';
import MoviesPage from '@/components/MoviesPage.vue';

const route = useRoute()
const group = ref<Group>()
const movies = ref<Array<Movie & { clicked?: boolean, rates?: Rate[], stars?: number, comment?: string }>>([])
const members = ref<Map<string, User>>()
const addMovieModal = ref(false)
const currentPage = ref<number>(1)
const moviesIsClear = ref<boolean>(false)
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

function rateMovie(movieId: string, comment: string, stars: number, resolver: () => void) {
  if (group.value && comment) {
    setMovieRate(movieId, comment, stars + '', group.value.id).then(res => {
      if (res.data) {
        updateRates(res.data, movieId)
        movies.value.forEach(m => {
          if (m.id == movieId) {
            m.comment = ''
          }
        })
        resolver()
      } else {
        resolver()
      }
    })
  } else {
    resolver()
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
    if (params.movies.length === 0) {
      moviesIsClear.value = true
    }
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

function onWatchClick(id: string, resolver: () => void) {
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
        resolver()
      }
    })
  } else {
    resolver()
  }
}

function onUnwatchClick(id: string, resolver: () => void) {
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
        resolver()
      }
    })
  } else {
    // resolver()
  }
}

function onMovieOpen(movieId: string) {
  movies.value.forEach(m => {
    if (m.id === movieId) {
      m.clicked = !m.clicked
      loadRates(m)
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
      moviesIsClear.value = true
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
  return new Promise<void>(resolve => {
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

function onRemoveRateClick(rateId: string, movieId: string) {
  removeRate(rateId).then(res => {
    if (res.message != 'success') {
      alert('ошибка')
      return
    }

    const [movie] = movies.value.filter(m => m.id == movieId)
    if (movie) {
      if (movie.rates) {
        movie.rates = movie.rates.filter(r => r.id != rateId)
      }
    }
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
      <div class="flex flex-col items-center">
        <AvatarWithPlaceholder class="w-20 lg:w-50 lg:h-50 h-20 text-7xl" :url="group?.avatar_url">
          <span class="text-7xl">{{ group?.name[0].toUpperCase() }}</span>
        </AvatarWithPlaceholder>
        <button @click="changeSettingsModal = true"
          class="btn btn-info mt-4 w-full hide lg:show lg:visible">Настроить</button>
      </div>

      <div class="desk lg:text-left text-center flex flex-col items-center lg:items-start">
        <h1 class=" max-w-4/5" v-if="group?.name">{{ group?.name }}</h1>
        <div class="flex flex-col items-center lg:items-start" v-else>
          <div class="skeleton h-20 w-70"></div>
          <div class="skeleton h-10 w-50 mt-4"></div>
        </div>
        <p class="mt-4">{{ group?.desc }}</p>
        <p><button @click="changeSettingsModal = true" class="btn btn-info mt-4 lg:absolute lg:hide">Настроить</button>
        </p>
      </div>
    </section>

    <section v-if="movies.length" class="">
      <h2 class="text-3xl font-black mb-5">Идеи для просмотра</h2>
      <button @click="addMovieModal = true" class="add-table-row-button mb-4">+</button>
      <!-- убрать бесконечную загрузку при отправке комментария без оценки -->
      <MoviesPage :class="{ 'opacity-50': movieListIsBlocked }" :movies="movies" :currentPage="currentPage"
        :members="members" @watch="onWatchClick" @open="(onMovieOpen)" @unwatch="onUnwatchClick" @rate="rateMovie"
        @removeMovie="(movieId) => {
          movieToRemove = movieId
          removeMovieModal = true
        }" @removeRate="onRemoveRateClick" />

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

    <div v-else-if="!moviesIsClear" class="section flex justify-center items-center h-100">
      <div class="skeleton w-full h-100"></div>
    </div>

    <div v-else class="alert alert-primary flex justify-between">
      <span class="text-lg">У вас пока не добавлено ни одного фильма</span>
      <button @click="addMovieModal = true" class="btn btn-primary">Добавить</button>
    </div>

  </div>
  <br>

</template>
