import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import GroupView from '@/views/GroupView.vue'
import InviteView from '@/views/InviteView.vue'
import TestView from '@/views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/groups/:id',
      name: 'group',
      component: GroupView,
    },

    {
      path: '/invite/:token',
      name: 'invite',
      component: InviteView,
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
  ],
})

export default router
