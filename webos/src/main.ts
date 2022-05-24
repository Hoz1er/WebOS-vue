import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import axios from 'axios'

import './style/main.css'
import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)
app.use(store).use(router).mount('#app')

app.use(VueAxios, axios)
