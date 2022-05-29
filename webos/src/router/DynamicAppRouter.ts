import { RouteRecordRaw } from 'vue-router'
import HelloWorld from '../component/HelloWorld.vue'
import CalendarComponent from '../component/CalendarComponent.vue'

const DynamicAppRouter: Array<RouteRecordRaw> = [
  {
    path: 'hello',
    component: HelloWorld
  },
  {
    path: 'calendar',
    component: CalendarComponent
  }
]

export default DynamicAppRouter
