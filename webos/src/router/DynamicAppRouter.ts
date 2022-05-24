import { RouteRecordRaw } from 'vue-router'
import HelloWorld from '../component/HelloWorld.vue'

const DynamicAppRouter: Array<RouteRecordRaw> = [
  {
    path: 'hello',
    component: HelloWorld
  }
]

export default DynamicAppRouter
