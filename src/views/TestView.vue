<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Movie, User, Rate } from '../../types/shared';
import { PAGE_LIMIT } from '../../constants/shared'
import AvatarWithPlaceholder from '@/components/AvatarWithPlaceholder.vue';


const movies = ref<Array<Movie & { clicked?: boolean, rates?: Rate[], stars?: number, comment?: string }>>([])
const members = ref<Map<string, User>>()
const currentPage = ref<number>(1)
const movieListIsBlocked = ref<boolean>(false)

const removeMovieModal = ref<boolean>(false)
const movieToRemove = ref<string>('')

onMounted(() => {
  members.value = new Map()
  members.value.set('1', { id: '1', username: '123', created_at: 'asdasd', pass: '', avatar: '' })

  movies.value = [
    {
      id: '1',
      name: "123",
      created_at: '123',
      desc: 'asd',
      user_id: '1',
      is_watched: true
    },
    {
      id: '1',
      name: "123",
      created_at: '123',
      desc: 'asd',
      user_id: '1',
      is_watched: true
    }
  ]
})

</script>


<template>
  <div class="container">


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
          <tr class="hover:bg-base-content/2 cursor-pointer group" @click.prevent="m.clicked = !m.clicked">
            <td class="hidden lg:table-cell">{{ (currentPage - 1) * PAGE_LIMIT + i + 1 }}</td>
            <th class="py-6 w-max">{{ m.name }}</th>
            <td class="max-w-50 hidden lg:table-cell" :class="{ 'truncate': !m.clicked }">{{ m.desc }}</td>
            <td class="hidden lg:table-cell">{{ m.created_at }}</td>
            <td class="hidden lg:table-cell">{{ members?.get(m.user_id)?.username || 'Аноним' }}</td>
            <td class="!m-0 lg:w-50 align-center text-center !p-1">
              <button v-if="!m.is_watched" class="btn btn-primary">
                <span class="hidden lg:inline">Посмотреть</span>
                <span class="lg:hidden">»</span>
              </button>

              <div v-else class="btn btn-square lg:btn-wide btn-success group-hover:btn-base">
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
              <button @click.stop="movieToRemove = m.id; removeMovieModal = true" class="btn btn-square btn-secondary">
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
                    <AvatarWithPlaceholder class="h-10 w-10 shrink-0" :url="members?.get(r.user_id)?.avatar || null">
                      <span>{{ members?.get(r.user_id)?.username[0].toUpperCase() || 'А' }}</span>
                    </AvatarWithPlaceholder>

                    <div class="chat chat-start">
                      <div class="chat-header">
                        <b class="ml-4"> {{ members?.get(r.user_id)?.username || 'Аноним' }}</b>
                        <time class="text-xs opacity-50">{{ r.rate }}/10</time>
                      </div>
                      <div class="chat-bubble text-xl">{{ r.comment }}</div>
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
              <button class="btn btn-lg w-full mt-4 btn-primary">Оценить
              </button>
              <!-- <div class="divider"></div> -->
              <button class="mt-4 btn btn-lg w-full btn-secondary">
                Не просмотрено
              </button>
            </td>
          </tr>
        </tbody>
      </table>


    </div>

  </div>
</template>
