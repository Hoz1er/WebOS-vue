import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DesktopView from '../view/DesktopView.vue'
import DynamicAppContainerView from '../view/DynamicAppContainerView.vue'
import DynamicAppRouter from './DynamicAppRouter'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'desktop',
    component: DesktopView
  },
  {
    path: '/app',
    name: 'app',
    component: DynamicAppContainerView,
    children: DynamicAppRouter
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
