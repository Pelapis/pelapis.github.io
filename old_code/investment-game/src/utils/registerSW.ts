import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    if (confirm('有新版本可用，是否重新加载？')) {
      location.reload()
    }
  },
  onOfflineReady() {
    console.log('PWA 应用已准备好离线工作')
  },
})
