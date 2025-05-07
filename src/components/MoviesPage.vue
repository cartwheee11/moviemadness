<script setup lang="ts">
import { ref } from 'vue';
import type { Movie, Rate, User } from '../../types/shared';
import { PAGE_LIMIT } from '../../constants/shared';
import AsyncButton from './AsyncButton.vue';
import AvatarWithPlaceholder from './AvatarWithPlaceholder.vue';

type CMovie = Movie & { clicked?: boolean, rates?: Rate[], stars?: number, comment?: string }

const { movies, members, currentPage } = defineProps<{
  movies: Array<CMovie> | undefined,
  members: Map<string, User> | undefined,
  currentPage: number
}>()

const emit = defineEmits<{
  watch: [movieId: string, resolver: () => void],
  rate: [movieId: string, comment: string, stars: number, resolver: () => void],
  open: [movieId: string],
  removeMovie: [movieId: string],
  unwatch: [movieId: string, resolver: () => void]
}>()

function onUnwatchClick(movieId: string) {
  return new Promise<void>((resolve) => {
    emit('unwatch', movieId, resolve)
  })
}

function onWatchClick(movieId: string) {
  return new Promise<void>((resolve) => {
    emit('watch', movieId, resolve)
  })
}

function onRateClick(movieId: string, comment: string, stars: number) {
  return new Promise<void>((resolve) => {
    emit('rate', movieId, comment, stars, resolve)
  })
}

const movieListIsBlocked = ref<boolean>(false)

</script>

<template>
  <div class="table-wrapper">
    <!-- переделать на флексбоксы -->
    <table class="table table-lg" :class="{ 'opacity-50': movieListIsBlocked }">
      <thead>
        <tr>
          <th class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell"></th>
          <th class="lg:w-1/6 w-full">Название</th>
          <th class="w-1/6 absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell">Комментарий</th>
          <th class="w-1/6 absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell">Дата</th>
          <th class="w-1/6 absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell">Добавил</th>
          <th class="lg:w-1/6 align-center text-center w-0 !p-0">Статус</th>
          <th class="lg:w-1/6 align-center text-center w-0 !p-0">Удалить</th>
        </tr>
      </thead>

      <tbody v-for="(m, i) in movies" :key="m.id">
        <tr class="hover:bg-base-content/2 cursor-pointer group" @click.prevent.stop="$emit('open', m.id)">
          <td class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell">
            {{ (currentPage - 1) * PAGE_LIMIT
              + i + 1 }}
          </td>
          <th class="py-6 w-max">{{ m.name }}</th>
          <td class="max-w-50 absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell"
            :class="{ 'truncate': !m.clicked }">{{ m.desc }}</td>
          <td class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell lg:z-1 -z-30">{{ m.created_at }}</td>
          <td class="absolute opacity-0 lg:relative lg:opacity-100 lg:table-cell lg:z-1 -z-30">
            {{ members?.get(m.user_id)?.username || 'Аноним' }}
          </td>
          <td class="!m-0 lg:w-50 align-center text-center !p-1">

            <AsyncButton @click="() => onWatchClick(m.id)" v-if="!m.is_watched"
              class="btn border-2 border-base-300 bg-base-100 btn-square lg:btn-block">
              <span class="absolute opacity-0 lg:relative lg:opacity-100 lg:inline">Посмотреть</span>
              <span class="lg:hidden">»</span>
            </AsyncButton>

            <button v-else class="btn btn-square lg:btn-wide btn-primary btn-md group-hover:btn-base">
              <!-- // TODO: вынести в компонент / заменить на font awesome -->
              <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square"
                    stroke-miterlimit="10" stroke-width="2"></circle>
                  <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square"
                    stroke-miterlimit="10" stroke-width="2"></polyline>
                </g>
              </svg>
              <span class="absolute opacity-0 lg:relative lg:opacity-100 lg:inline">Посмотрели</span>
            </button>
          </td>
          <td class="delete-cell text-center">
            <button @click="$emit('removeMovie', m.id); console.log('hello')"
              class="btn border-2 border-base-300 bg-base-100 btn-md btn-circle">
              <!-- // TODO: вынести в компонент / заменить на font awesome -->
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
            <div v-if="!m.rates" class="flex py-10 w-full items-center justify-center">
              <!-- <div class="skeleton w-full h-20 mb-4"></div> -->
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
                    <div class="chat-bubble text-xl flex chat-bubble-accent">
                      <span>{{ r.comment }}
                        <!-- <span class="badge badge-sm badge-ghost opacity-50 cursor-pointer">удалить</span> -->
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
            <AsyncButton @click="() => onRateClick(m.id, m.comment || '', m.stars || 0,)"
              class="btn btn-lg w-full mt-4 btn-primary">Оценить
            </AsyncButton>
            <AsyncButton @click="() => onUnwatchClick(m.id)"
              class="mt-4 btn btn-lg w-full bg-base-300 !border-none hover:opacity-80">
              Не просмотрено
            </AsyncButton>
          </td>
        </tr>
      </tbody>
    </table>


  </div>
</template>
