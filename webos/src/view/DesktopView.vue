<!--
    桌面
    图标、任务栏、活动窗口
-->

<template>
  <div class="desktop">
    <!-- 主界面 begin-->
    <div class="main">
      <!-- 图标容器 -->
      <div class="shortcut-box">
        <div
          class="shortcut-item"
          v-for="item in quickLinkList"
          v-bind:key="item.id"
        >
          <img class="shortcut-icon" alt="" :src="item.icon" />
          <div class="shortcut-text">{{ item.text }}</div>
          <div class="shortcut-mask" @click="linkClick(item)"></div>
        </div>
      </div>
      <!-- 任务栏 -->
      <div class="task-bar">
        <!-- 开始菜单 -->
        <div class="task-bar-left"></div>
        <!-- 已打开的窗口列表 -->
        <!-- <div class="task-bar-windows"></div> -->
        <el-scrollbar class="task-bar-windows">
          <div
            v-for="item in ongoingWindowList"
            :key="item.id"
            :class="
              item.windowShowing
                ? 'task-bar-windows-item-active  task-bar-windows-item'
                : 'task-bar-windows-item'
            "
            @click="trrigerOngoingWindowShowing(item)"
            :title="item.title"
          >
            <img :src="item.icon" alt="" />
          </div>
        </el-scrollbar>
        <!-- 托盘信息 -->
        <div class="task-bar-right"></div>
      </div>
      <!-- 底部版权 -->
      <footer>
        <a class="beian" href="https://beian.miit.gov.cn/" target="_blank">{{
          beian
        }}</a>
      </footer>
    </div>
    <!-- 主界面 end-->
    <!-- 其他动态部件 begin -->
    <div></div>
    <!-- 其他动态部件 end -->
    <!-- 打开的窗口 begin -->
    <div>
      <!-- 单个窗口 -->
      <div
        class="app-window"
        v-for="item in ongoingWindowList"
        :key="item.id"
        :ref="recordDynamicApp"
        :style="computePosition(item)"
        v-show="item.windowShowing"
      >
        <!-- 标题栏 -->
        <div
          class="app-title-bar"
          @mousedown="appWindowMouseDown($event, item)"
          @mousemove="appWindowMouseMove($event, item)"
          @mouseup="appWindowMouseUp($event, item)"
          @mouseleave="appWindowMouseLeave($event, item)"
        >
          <div class="app-title">
            <span>{{ item.title }}</span>
          </div>
          <div class="app-title-bar-middle"></div>
          <div class="app-button-bar">
            <i
              class="fa fa-refresh"
              title="刷新"
              @click="refreshOngoingWindow(item)"
            ></i>
            <i
              class="fa fa-minus"
              title="最小化"
              @click="hideOngoingWindow(item)"
            ></i>
            <i
              class="fa fa-close"
              title="关闭"
              @click="closeOngoingWindow(item)"
            ></i>
          </div>
        </div>
        <!-- 内容 -->
        <div class="app-content">
          <iframe
            class="app-content-iframe"
            :src="item.targetUrl"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- 打开的窗口 end -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, onUpdated, Ref, VNodeRef } from 'vue'

class QuickLinkItem {
  id = ''
  icon = ''
  text = ''
  target = ''
  singleton = true
}
class OngoingWindowItem {
  id = ''
  openTime!: Date
  linkId = ''
  windowIndex = 0
  windowShowing = false
  targetUrl = ''
  title = ''
  isMoving = false
  top = 100
  left = 100
  icon = ''
}

export default defineComponent({
  components: {},
  setup () {
    // 当前任务对应的元素列表
    let ongoingWindowRefList: VNodeRef[] = []
    // 记录动态app
    const recordDynamicApp = (el: VNodeRef) => {
      ongoingWindowRefList.push(el)
      return el
    }
    onBeforeUpdate(() => {
      ongoingWindowRefList = []
    })
    onUpdated(() => {
      // console.log('ongoingWindowRefList', ongoingWindowRefList)
    })

    return {
      ongoingWindowRefList,
      recordDynamicApp
    }
  },
  data () {
    // 快捷方式列表
    const quickLinkList: QuickLinkItem[] = []
    // 当前任务列表
    const ongoingWindowList: OngoingWindowItem[] = []

    return {
      quickLinkList,
      ongoingWindowList,
      appWindowMoveAttr: {
        offsetX: 0,
        offsetY: 0,
        isMoving: false
      },
      beian: ''
    }
  },
  mounted () {
    this.refreshQuickLinkList()
    this.getBeian()
  },
  methods: {
    computePosition (ongoingWindowItem: OngoingWindowItem) {
      return `top:${ongoingWindowItem.top}px;left:${ongoingWindowItem.left}px;`
    },
    getBeian (): void {
      this.axios.get('/fakeapi/basic/getbeian.json').then((response) => {
        // console.log('response:', response)
        if (response.status === 200) {
          this.beian = response.data.beian
        }
      })
    },
    // 获取快捷方式列表
    refreshQuickLinkList (): void {
      this.axios
        .get('/fakeapi/desktop/getlistquicklink.json')
        .then((response) => {
          // console.log('response:', response)
          if (response.status === 200) {
            this.quickLinkList = response.data
          }
        })
        .catch((resaon) => {
          console.log('resaon:', resaon)
        })
    },
    // 点击快捷方式
    linkClick (item: QuickLinkItem): void {
      if (item.singleton) {
        let exists = false
        this.ongoingWindowList.forEach((element) => {
          if (element.linkId === item.id) {
            exists = true
            this.showOngoingWindow(element)
            return false
          }
        })
        if (exists) {
          return
        }
      }

      this.addNewOngoingWindow(item)
    },
    // 添加新的窗口
    addNewOngoingWindow (quickLinkItem: QuickLinkItem): void {
      const item = new OngoingWindowItem()
      item.id = Math.floor(Math.random() * 10000).toString()
      item.linkId = quickLinkItem.id
      item.openTime = new Date()
      item.targetUrl = quickLinkItem.target
      item.windowIndex = 100
      item.windowShowing = false
      item.title = quickLinkItem.text
      item.icon = quickLinkItem.icon

      this.ongoingWindowList.push(item)
      this.showOngoingWindow(item)
    },

    // 显示指定的窗口
    showOngoingWindow (ongoingWindowItem: OngoingWindowItem): void {
      this.ongoingWindowList.forEach((element) => {
        if (element.id !== ongoingWindowItem.id) {
          element.windowShowing = false
        } else {
          element.windowShowing = true
        }
      })
    },
    hideOngoingWindow (ongoingWindowItem: OngoingWindowItem): void {
      ongoingWindowItem.windowShowing = false
    },
    trrigerOngoingWindowShowing (ongoingWindowItem: OngoingWindowItem): void {
      if (!ongoingWindowItem.windowShowing) {
        this.showOngoingWindow(ongoingWindowItem)
      } else {
        this.hideOngoingWindow(ongoingWindowItem)
      }
    },
    // 关闭指定的窗口
    closeOngoingWindow (ongoingWindowItem: OngoingWindowItem): void {
      this.ongoingWindowList.forEach((element, index) => {
        if (element.id === ongoingWindowItem.id) {
          this.ongoingWindowList.splice(index, 1)
          return false
        }
      })
    },
    // 刷新指定的窗口
    refreshOngoingWindow (ongoingWindowItem: OngoingWindowItem): void {
      const url = ongoingWindowItem.targetUrl
      ongoingWindowItem.targetUrl = ''
      this.$nextTick(() => {
        ongoingWindowItem.targetUrl = url
      })
    },
    appWindowMouseDown (
      event: MouseEvent,
      ongoingWindowItem: OngoingWindowItem
    ) {
      // 鼠标按下事件
      this.appWindowMoveAttr.offsetX = event.offsetX
      this.appWindowMoveAttr.offsetY = event.offsetY
      ongoingWindowItem.isMoving = true
    },
    // 鼠标移动
    appWindowMouseMove (
      event: MouseEvent,
      ongoingWindowItem: OngoingWindowItem
    ) {
      if (!ongoingWindowItem.isMoving) {
        return
      }
      ongoingWindowItem.left =
        ongoingWindowItem.left +
        (event.offsetX - this.appWindowMoveAttr.offsetX)
      ongoingWindowItem.top =
        ongoingWindowItem.top + (event.offsetY - this.appWindowMoveAttr.offsetY)
    },
    // 鼠标抬起
    appWindowMouseUp (event: MouseEvent, ongoingWindowItem: OngoingWindowItem) {
      ongoingWindowItem.isMoving = false
    },
    appWindowMouseLeave (
      event: MouseEvent,
      ongoingWindowItem: OngoingWindowItem
    ) {
      this.appWindowMouseMove(event, ongoingWindowItem)
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.desktop {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0d1117;
}

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.shortcut-box {
  flex: auto;
  height: 0;
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  place-self: self-start;
  padding: 10px 0;
}

.shortcut-item {
  width: 85px;
  height: 90px;
  margin: 5px;
}

.shortcut-icon {
  width: 48px;
  height: 48px;
  display: block;
  margin: 0 auto 2px auto;
}

.shortcut-text {
  height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 12px;
  text-align: center;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  color: white;
}

.shortcut-mask {
  position: relative;
  top: -85px;
  left: 0px;
  width: 85px;
  height: 90px;
  background-color: #000;
  opacity: 0.2;
  cursor: pointer;
}

.shortcut-mask:hover {
  opacity: 0;
}

.task-bar {
  flex-grow: 0;
  flex-shrink: 0;
  background-color: black;
  opacity: 0.8;
  height: 40px;
  display: flex;
  flex-direction: row;
}
.task-bar-left {
  flex-shrink: 0;
  flex-grow: 0;
  width: 100px;
}
.task-bar-windows {
  flex: 1;
  width: 0;
  position: relative;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
}
.task-bar-windows-item {
  display: inline-block;
  width: 36px;
  height: 36px;
  padding: 4px;
  cursor: pointer;
}
.task-bar-windows-item-active {
  border-bottom: 1px solid #fff;
}
.task-bar-windows-item:hover {
  box-shadow: 1px 1px 5px #e3e3e3;
}
.task-bar-windows-item img {
  width: 100%;
  height: 100%;
}
.task-bar-right {
  flex-shrink: 0;
  flex-grow: 0;
  width: 300px;
}

footer {
  flex-grow: 0;
  flex-shrink: 0;
  background-color: black;
  opacity: 0.8;
  height: 20px;
  line-height: 18px;
  text-align: center;
  border-top: 1px solid #e3e3e3;
}
.beian {
  color: white;
  text-decoration: none;
  font-size: 16px;
}
.beian:hover {
  text-decoration: underline;
}
.app-window {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 10%;
  left: 10%;
  width: 70%;
  height: 70%;
  z-index: 100;
}
.app-title-bar {
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  height: 40px;
  background-color: #000;
  opacity: 0.7;
  color: white;
  font-size: 16px;
  line-height: 40px;
  padding-left: 10px;
  cursor: move;
}
.app-title {
  flex-grow: 0;
  flex-shrink: 0;
  line-height: 20px;
  border-left: 2px solid #fff;
  margin: 10px 5px;
  padding-left: 10px;
}
.app-title-bar-middle {
  flex-grow: 1;
  flex-shrink: 1;
}
.app-button-bar {
  flex-grow: 0;
  flex-shrink: 0;
  cursor: pointer;
}
.app-button-bar i {
  padding: 0 5px;
}
.app-content {
  flex-grow: 1;
  background-color: #e3e3e3;
}
.app-content-iframe {
  width: 100%;
  height: 100%;
}
</style>
