import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { configure } from 'vee-validate'
configure({
  validateOnInput: true,
  validateOnChange: true,
})
library.add(far, fas)

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App).component('fa', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
