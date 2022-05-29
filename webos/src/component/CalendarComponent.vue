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
    <el-scrollbar height="750px">
      <div class="calendar-box">
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
              <span class="calendar-item-month" v-if="item.diffMonth.length > 0"
                >{{ item.diffMonth }}月</span
              >
            </div>
            <i class="fa fa-plus task-plus">添加新任务</i>
          </div>
          <el-scrollbar height="250px">
            <ul class="task-box">
              <li
                class="task-item"
                v-for="taskItem in item.taskList"
                :key="taskItem.id"
                :title="taskItem.subject"
              >
                {{ taskItem.subject }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </el-scrollbar>
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
    const currentDate = this.getDateText(new Date())
    const mainMonthFirstDate = new Date(currentDate.substring(0, 7) + '-01')
    return {
      mainMonthFirstDate,
      currentDate,
      calendarDateList
    }
  },
  methods: {
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
      const monthStr = this.getDateText(this.mainMonthFirstDate).substring(0, 7)
      for (let i = 0; i < 35; i++) {
        const item = new CalendarDateItem()
        const tempDate = new Date(beginDate.setDate(beginDate.getDate() + 1))
        item.date = this.getDateText(tempDate)
        if (!item.date.startsWith(monthStr)) {
          item.diffMonth = tempDate.getMonth() + 1 + ''
        }
        item.dayOfMonth = tempDate.getDate() + ''
        const taskItem = new TaskItem()
        taskItem.id = '111'
        taskItem.subject = '测试测试测试1111112222223333334444445555555'
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        item.taskList.push(taskItem)
        dateList.push(item)
      }
      this.calendarDateList = dateList
    },
    getDateText (date: Date): string {
      return (
        date.getFullYear().toString() +
        '-' +
        (date.getMonth() > 8 ? '' : '0') +
        (date.getMonth() + 1) +
        '-' +
        (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
      )
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app {
  background-color: #f6f5e3;
}
.calendar-title {
  padding: 10px 0;
  font-size: 20px;
}
.calendar-title i {
  margin-left: 10px;
  cursor: pointer;
  padding: 0 6px;
  border-radius: 50%;
  background-color: #f37f56;
}
.week-box {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.calendar-box {
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
  padding: 0 6px;
  background-color: #abb0af;
  color: #fff;
  border-radius: 8px;
}
.calendar-item-title {
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.calendar-item-dayofmonth {
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
  padding: 6px;
  border-radius: 12px;
  cursor: pointer;
}
</style>
