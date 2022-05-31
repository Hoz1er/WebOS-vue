import { App } from 'vue'

export interface IUtil {
  generateUUID(): string
  getDateText(date: Date): string
}

export const Util = {
  generateUUID () {
    let d = new Date().getTime()

    let uuid = ''
    for (let i = 0; i < 32; i++) {
      uuid += ((((d + Math.random() * 16) % 16 | 0) & 0x3) | 0x8).toString(16)

      d = Math.floor(d / 16)
    }
    return uuid
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

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $util: IUtil
  }
}

export default function install (app: App): App {
  app.config.globalProperties.$util = Util
  return app
}
