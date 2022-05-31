import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import axios from 'axios'

import './style/main.css'
import 'font-awesome/css/font-awesome.min.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

import Util from './script/util'

const app = createApp(App)
app
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .use(ElementPlus, { size: 'small', zIndex: 1000, locale: zhCn })
  .use(Util)

app.mount('#app')
