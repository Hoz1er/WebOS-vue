import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import axios from 'axios'

import './style/main.css'
import 'font-awesome/css/font-awesome.min.css'

import {
  // create naive ui
  create,
  // component
  NButton,
  NLayout,
  NScrollbar,
  NLoadingBarProvider,
  NText
} from 'naive-ui'

const naiveUI = create({
  components: [NButton, NLayout, NScrollbar, NLoadingBarProvider, NText]
})

const app = createApp(App)
app.use(store).use(router)

app.use(VueAxios, axios).use(naiveUI)

app.mount('#app')
