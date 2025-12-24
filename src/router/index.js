import { createRouter, createWebHashHistory } from "vue-router"

import Layout from "../views/Main.vue"
import Login from "../views/login/index.vue"

const routes = [
    {
        path: '/',
        component: Layout,
        name: 'main',
        redirect: to => {
            const localData = localStorage.getItem('pzv2_v3pz')
            //console.log("localData: ", localData);

            // 有子菜单的情况，跳转到子菜单
            if (localData) {
                
                const child = JSON.parse(localData).menu.routerList[0].children
                if (child) {
                    return child[0].meta.path
                }
                // 无子菜单，直接跳转
                else {
                    return JSON.parse(localData).menu.routerList[0].meta.path
                }    
            }
            // 缓存不存在的情况
            else {
                //console.log("缓存不存在");
                return '/login'
            }
        },
        children: [
        ]
    },
    {
        path: '/login',
        component: Login
    }
]

const router = createRouter({
    // 路由数据
    routes,
    // 路由匹配模式
    history: createWebHashHistory()
})

export default router