<script setup lang="ts">
// import { ref } from 'vue';
import type { Group, GroupMovieRemoval, GroupSettingMovieStatus, Movie, Rate, User } from '../../types/shared';
// import { PAGE_LIMIT } from '../../constants/shared';
import AsyncButton from './AsyncButton.vue';
import AvatarWithPlaceholder from './AvatarWithPlaceholder.vue';
import { useAuth } from '@/stores/auth';
import ListItem from './ListItem.vue';
import { onBeforeMount, ref, watch, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { editGroup, getGroup, getRates, removeRate, setMovieRate } from '@/api';
import ModalWindow from './ModalWindow.vue';
const route = useRoute()

type CMovie = Movie & { clicked?: boolean, rates?: CRate[], stars?: number, comment?: string, isLoading?: boolean }
type CRate = Rate & { isLoading?: boolean }
const movies = ref<CMovie[]>([])
const members = ref<Map<string, User>>()
const group = ref<Group>()
const isMoviesListBlocked = ref<boolean>(false)
const moviesIsClear = ref<boolean>(false)

function updatePage(params: { movies?: Movie[], members?: User[], group: Group }) {
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

function loadPage() {
  isMoviesListBlocked.value = true;
  getGroup(route.params.id as string, currentPage).then(res => {
    if (!res.data) {
      return
    }

    if (res.data.movies.length === 0) {
      moviesIsClear.value = true
    }

    isMoviesListBlocked.value = false

    updatePage({
      group: res.data.group,
      movies: res.data.movies,
      members: res.data.members
    })
  })
}

onBeforeMount(() => {
  loadPage()
})

const { currentPage = 1 } = defineProps<{
  currentPage: number
}>()



watch(() => currentPage, () => {
  loadPage()
})

function onWatchClick(m: CMovie) {
  m.isLoading = true;
  const promise = new Promise<void>(resolve => {
    watchMovie(m.id, resolve)
  })

  promise.then(() => {
    m.isLoading = false
  })
}

function watchMovie(id: string, resolver: () => void) {
  if (group.value) {
    const request: GroupSettingMovieStatus = {
      groupId: group.value.id,
      aim: 'settingMovieStatus',
      movieId: id,
      watched: true
    }

    editGroup(request, currentPage).then(res => {
      if (res.data) {
        updatePage(res.data)
        resolver()
      }
    })
  } else {
    resolver()
  }
}

function onUnwatchClick(m: CMovie) {
  m.isLoading = true;
  const promise = new Promise<void>(resolve => {
    unwatchMovie(m.id, resolve)
  })

  promise.then(() => {
    m.isLoading = false
  })

  return promise
}

function unwatchMovie(id: string, resolver: () => void) {
  if (group.value) {
    const request: GroupSettingMovieStatus = {
      groupId: group.value.id,
      aim: 'settingMovieStatus',
      movieId: id,
      watched: false
    }

    console.log('currentPaage: ' + currentPage)

    editGroup(request, currentPage).then(res => {
      if (res.data) {
        updatePage(res.data)
        resolver()
      }
    })
  } else {
    resolver()
  }
}

function rateMovie(m: CMovie, comment: string, stars: number) {
  return new Promise<void>(resolver => {
    if (group.value && comment) {
      setMovieRate(m.id, comment, stars + '', group.value.id).then(res => {
        if (res.data) {
          updateRates(res.data, m)

          m.comment = ''

          resolver()
        } else {
          resolver()
        }
      })
    } else {
      resolver()
    }
  })

}

function loadRates(m: CMovie) {
  if (m.is_watched) {
    getRates(m.id).then(res => {
      if (res.data) {
        m.rates = res.data
      }
    })
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
const removeMovieModal = ref<boolean>(false)
const movieToRemove = ref<string>('')
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

    editGroup(params, currentPage).then((res) => {
      removeMovieModal.value = false
      if (!res || !res.data) {
        return resolve()
      }
      updatePage(res.data)

      resolve()
    })
  })
}

function onRemoveRateClick(r: CRate, m: CMovie) {
  r.isLoading = true;
  removeRate(r.id).then(res => {
    if (res.message != 'success') {
      alert('ошибка')
      return

    }

    r.isLoading = false
    m.rates = m.rates?.filter(rate => rate.id != r.id)
  })
}

const auth = useAuth()


function updateRates(rates: Rate[], m: CMovie) {
  m.rates = rates
}


defineExpose<{ loadPage: () => void }>({
  loadPage
})

</script>

<template>
  <ModalWindow @hide="removeMovieModal = false" :visible="removeMovieModal">
    <h3 class="font-black text-xl">Удалить фильм?</h3>
    <p class="mt-4">Это действие нельзя отменить</p>
    <AsyncButton class="btn btn-primary mt-4" @click="() => onRemoveMovieButtonClick()">
      Удалить
    </AsyncButton>
  </ModalWindow>

  <div v-if="!moviesIsClear && !movies.length" class="section flex justify-center items-center h-100">
    <div class="skeleton w-full h-100"></div>
  </div>

  <div v-else-if="!movies.length" class="alert alert-error p-5">
    <span class="text-lg">У вас пока не добавлено ни одного фильма</span>
  </div>
  <ListItem v-else :class="{ 'opacity-50': isMoviesListBlocked }">
    <div v-for="(m) in movies" :key="m.id" class="text-lg lg:!px-7 lg:!py-5" :class="{ 'opacity-50': m.isLoading }">
      <div class="cursor-pointer flex items-center gap-10" @click.prevent.stop="onMovieOpen(m.id)">
        <input @click.stop="m.is_watched ? onUnwatchClick(m) : onWatchClick(m)" :checked="m.is_watched" ick.stop
          type="checkbox" class="checkbox checkbox-success checkbox-lg" />
        <div class="lg:w-2/6">
          <div class="mont font-bold">{{ m.name }}</div>
          <div class="max-w-50 text-gray-400 font-semibold" :class="{ 'truncate': !m.clicked }">{{ m.desc
            }}</div>
        </div>


        <div class="flex items-center justify-between grow hide lg:show">
          <div class="flex items-center gap-4  w-1/4">
            <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="members?.get(m.user_id)?.avatar || null">
              <span>{{ members?.get(m.user_id)?.username[0].toUpperCase() || 'А' }}</span>
            </AvatarWithPlaceholder>
            <div class="flex flex-col w-full">
              <span class="font-semibold truncate">
                {{ members?.get(m.user_id)?.username || 'Аноним' }}
              </span>

              <span class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell lg:z-1 -z-30 text-sm">{{
                m.created_at
              }}</span>

            </div>
          </div>
          <div class="">
            <span class="badge" :class="{ 'badge-neutral': m.is_watched, 'badge-ghost': !m.is_watched }">{{ m.is_watched
              ?
              "смотрели" :
              'не смотрели' }}</span>
          </div>
          <div class="delete-cell text-center">
            <button @click.stop="movieToRemove = m.id; removeMovieModal = true"
              class="btn border-2 border-base-300 bg-base-100 btn-md btn-circle">

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                viewBox="0 0 16 16">
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-if="m.clicked && m.is_watched" class="w-full">
        <div class="py-4 w-full">
          <div v-if="!m.rates" class="flex py-10 !w-full items-center justify-center">

            <div class="loading loading-spinner"></div>
          </div>

          <div v-else-if="m.rates.length == 0" class="p-10 pb-12 text-center">
            <span class="font-bold">Напиши первый отзыв</span>
          </div>

          <div class="pb-4" v-else>
            <div class="m-2 mb-4" v-for="r in m.rates" :key="r.id">
              <div class="message flex items-end">
                <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="members?.get(r.user_id)?.avatar || null">
                  <span>{{ members?.get(r.user_id)?.username[0].toUpperCase() || 'А' }}</span>
                </AvatarWithPlaceholder>

                <div class="chat chat-start">
                  <div class="chat-header">
                    <b class="ml-4"> {{ members?.get(r.user_id)?.username || 'Аноним' }}</b>
                    <time class="text-xs opacity-50">{{ r.rate }}/10</time>
                  </div>
                  <div :class="{ 'opacity-50': r.isLoading }"
                    class="chat-bubble text-xl flex chat-bubble-primary bg-base-300 mont font-semibold">
                    <span>{{ r.comment }}

                      <span @click="onRemoveRateClick(r, m)" v-if="r.user_id == auth.profile?.user.id"
                        class="badge badge-sm badge-ghost opacity-50 cursor-pointer">удалить</span>
                    </span>

                  </div>
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
          <AsyncButton @click="() => rateMovie(m, m.comment || '', m.stars || 0)"
            class="btn btn-lg w-full mt-4 btn-primary">Оценить
          </AsyncButton>
          <AsyncButton @click="() => onUnwatchClick(m)"
            class="mt-4 btn btn-lg w-full bg-base-300 !border-none hover:opacity-80">
            Не просмотрено
          </AsyncButton>
        </div>
      </div>
    </div>
  </ListItem>
  <br>
</template>
