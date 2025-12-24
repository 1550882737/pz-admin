import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import PanelHead from './components/panelHead.vue'
import 'element-plus/dist/index.css'

// 刷新后的动态路由添加
const localData = localStorage.getItem('pzv2_v3pz')
if (localData) {
  store.commit('dynamicMenu', JSON.parse(localData))
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main', item)
  })
}


// 路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pzv2_token')
  // 非登录界面且token不存在
  if (!token && to.path !== '/login') {
    console.log("token不存在，返回登录界面");
    return '/login'
  }
  // token已存在且还在登录界面
  else if (token && to.path === '/login') {
    console.log("token已存在且还在登录界面");
    
    return '/'
  }
  else {
    return true
  }
})


const app = createApp(App)

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('PanelHead', PanelHead)

// 路由挂载
app.use(router)
// store 挂载
app.use(store)
app.mount('#app')
