import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'animate.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入Mock服务
import { startMockService } from './api/mock'

const app = createApp(App)
const pinia = createPinia()

// 在开发环境中启动Mock服务
if (import.meta.env.DEV) {
  startMockService()
  console.log('开发环境: Mock服务已启动')
}

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000,
})

app.mount('#app')