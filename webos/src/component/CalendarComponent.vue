<!-- author: luxiaoban -->
<template>
  <div class="app">
    <div class="tc calendar-title">
      <el-date-picker
        v-model="mainMonthFirstDate"
        type="month"
        :change="generateDateList()"
      />
    </div>
    <div class="week-box">
      <div class="week-item">日</div>
      <div class="week-item">一</div>
      <div class="week-item">二</div>
      <div class="week-item">三</div>
      <div class="week-item">四</div>
      <div class="week-item">五</div>
      <div class="week-item">六</div>
    </div>
    <el-divider class="calendar-divider" />
    <div class="calendar-box">
      <el-scrollbar>
        <div class="calendar-list">
          <div
            v-for="item in calendarDateList"
            :key="item.date"
            :class="
              item.date === currentDate
                ? 'calendar-item calendar-item-today'
                : item.diffMonth.length > 0
                ? 'calendar-item calendar-item-diffmonth'
                : 'calendar-item'
            "
          >
            <div class="calendar-item-title">
              <div class="calendar-item-date">
                <span class="calendar-item-dayofmonth">{{
                  item.dayOfMonth
                }}</span>
                <span
                  class="calendar-item-month"
                  v-if="item.diffMonth.length > 0"
                  >{{ item.diffMonth }}月</span
                >
              </div>
              <i class="fa fa-plus task-plus"></i>
            </div>
            <el-scrollbar>
              <ul class="task-box">
                <li
                  class="task-item"
                  v-for="taskItem in item.taskList"
                  :key="taskItem.id"
                  :title="taskItem.subject"
                >
                  <span v-if="taskItem.urgent === '1'">急</span>
                  <span v-if="taskItem.delay === '1'">延</span>
                  {{ taskItem.subject }}
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

class TaskItem {
  id = ''
  text = ''
  subject = ''
  deadline = ''
  beginDate = ''
  endDate = ''
  urgent = '0'
  delay = '0'
}

class CalendarDateItem {
  date = ''
  title = ''
  diffMonth = ''
  dayOfMonth = ''
  taskList: TaskItem[] = []
}
export default defineComponent({
  components: {},
  props: {},
  data () {
    const calendarDateList: CalendarDateItem[] = []
    const currentDate = this.$util.getDateText(new Date())
    const mainMonthFirstDate = new Date(currentDate.substring(0, 7) + '-01')
    const currentTaskList: TaskItem[] = []
    return {
      mainMonthFirstDate,
      currentDate,
      calendarDateList,
      currentGetTaskRequestId: '',
      currentTaskList
    }
  },
  methods: {
    // 生成日期列表
    generateDateList () {
      console.log('generateDateList')
      this.calendarDateList = []
      const dateList = []
      const currentMonthFirstDate = new Date(this.mainMonthFirstDate)
      const beginDate = new Date(
        currentMonthFirstDate.setDate(
          currentMonthFirstDate.getDate() - currentMonthFirstDate.getDay() - 1
        )
      )
      const monthStr = this.$util
        .getDateText(this.mainMonthFirstDate)
        .substring(0, 7)
      for (let i = 0; i < 35; i++) {
        const item = new CalendarDateItem()
        const tempDate = new Date(beginDate.setDate(beginDate.getDate() + 1))
        item.date = this.$util.getDateText(tempDate)
        if (!item.date.startsWith(monthStr)) {
          item.diffMonth = tempDate.getMonth() + 1 + ''
        }
        item.dayOfMonth = tempDate.getDate() + ''
        dateList.push(item)
      }
      this.calendarDateList = dateList
      this.getTaskList()
    },
    // 获取任务列表
    getTaskList () {
      this.currentTaskList = []
      const currentId = this.$util.generateUUID()
      this.currentGetTaskRequestId = currentId
      this.axios
        .get('/fakeapi/calendar/getlisttask.json')
        .then((response) => {
          if (currentId !== this.currentGetTaskRequestId) {
            return
          }
          // console.log('response:', response)
          if (response.status === 200) {
            this.currentTaskList = response.data as TaskItem[]
            this.calcCurrentTaskShow()
          }
        })
        .catch((resaon) => {
          console.log('resaon:', resaon)
        })
    },
    // 计算每天的任务展示
    calcCurrentTaskShow () {
      const taskList = this.currentTaskList
      if (taskList.length < 1) {
        return
      }

      const dateList = this.calendarDateList
      dateList.forEach((dateItem) => {
        taskList.forEach((taskItem) => {
          if (
            taskItem.beginDate <= dateItem.date &&
            (taskItem.endDate >= dateItem.date ||
              (taskItem.endDate === '' &&
                (taskItem.deadline === '' ||
                  taskItem.deadline >= dateItem.date ||
                  this.currentDate >= dateItem.date)))
          ) {
            const task = JSON.parse(JSON.stringify(taskItem)) as TaskItem
            task.delay =
              taskItem.deadline !== '' && taskItem.deadline < dateItem.date
                ? '1'
                : '0'
            dateItem.taskList.push(task)
          }
        })
      })
      this.calendarDateList = dateList
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app {
  height: 100%;
  background-color: #f6f5e3;
  display: flex;
  flex-direction: column;
}
.calendar-title {
  padding: 10px 0;
  font-size: 20px;
  flex-grow: 0;
  flex-shrink: 0;
}
.calendar-title i {
  margin-left: 10px;
  cursor: pointer;
  padding: 0 6px;
  border-radius: 50%;
  background-color: #f37f56;
}
.week-box {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-grow: 0;
  flex-shrink: 0;
}
.calendar-divider {
  margin: 5px;
}
.calendar-box {
  width: 100%;
  height: 0;
  flex-grow: 1;
  flex-shrink: 1;
}
.calendar-list {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.week-item {
  display: flex;
  width: calc((100% - 70px) / 7);
  min-width: calc((100% - 70px) / 7);
  max-width: calc((100% - 70px) / 7);
  justify-content: center;
  margin: 5px;
}
.calendar-item {
  height: 300px;
  display: flex;
  width: calc((100% - 70px) / 7);
  min-width: calc((100% - 70px) / 7);
  max-width: calc((100% - 70px) / 7);
  flex-direction: column;
  border-radius: 14px;
  margin: 5px;
  background-color: #fbead8;
  border: 4px solid #fff;
  box-shadow: 1px 1px 3px #999;
}
.calendar-item-today {
  background-color: #fee8bf;
}
.calendar-item-diffmonth {
  color: #abb0af;
}
.calendar-item-month {
  margin-left: 5px;
  color: #abb0af;
  font-size: 12px;
}
.calendar-item-title {
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.calendar-item-dayofmonth {
  margin-left: 16px;
  font-size: 20px;
  font-weight: 800;
}
.task-box {
  list-style: inside;
  list-style-type: decimal;
  padding-left: 10px;
}
.task-item {
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
}
.task-plus {
  background-color: #f37f56;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
