<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute, useRouter } from 'vue-router';

    const store = useStore()
    const selcetMenu = computed(() => store.state.menu.selectMenu)

    const route = useRoute()

    const router = useRouter()

    const userInfo = JSON.parse(localStorage.getItem('pzv2_userInfo'))
    
    // 点击关闭tag
    const closeTab = (item, index) => {
        store.commit('closeMenu', item)
        // 删除非当前页tag
        if (route.path !== item.path) {
            return
        }
        const selectMenuData = selcetMenu.value
        // 删除位于最后一个位置的tag
        if (index === selectMenuData.length) {
            // 删除完所有tag后返回根路由
            if (!selectMenuData.length){
                router.push('/')
            }
            else {
                // 删除完前面还有tag则前移
                router.push({
                    path: selectMenuData[index - 1].path
                })
            }
        }
        else {  // 删除中间位置的tag则往转到后面的tag
            router.push({
                path: selectMenuData[index].path
            })
        }

    }

    const handleClick = (command) => {
        if (command === 'cancel') {
            localStorage.removeItem('pzv2_token')
            localStorage.removeItem('pzv2_userInfo')
            localStorage.removeItem('pzv2_v3pz')
            window.location.href = window.location.origin
        }
    }

</script>

<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
            <ul class="flex-box">
                <li v-for="(item, index) in selcetMenu"
                    :key="item.path"
                    :class="{ selected: route.path === item.path }"
                    class="tab flex-box">
                    <el-icon size="12"><component :is="item.icon" /></el-icon>
                    <router-link class="text flex-box" :to="{ path: item.path }">
                        {{ item.name }}
                    </router-link>
                    <el-icon class="close" size="12" @click="closeTab(item, index)"><Close /></el-icon>
                    
                </li>
            </ul> 
        </div>
        <div class="header-right">
            <el-dropdown @command="handleClick">
                <div class="el-dropdown-link flex-box">
                     <el-avatar
                        :src="userInfo.avatar"
                    />
                    <p class="user-name">{{ userInfo.name }}</p>
                </div>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="cancel">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped>
    .flex-box {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        background-color: #fff;
        padding-right: 25px;
    }

    .header-left {
        height: 100%;
        .icon {
            width: 45px;
            height: 100%;
        }
        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .tab {
            padding: 0 10px;
            height: 100%;
            .text {
                margin: 0 5px;
            }
            .close {
                visibility: hidden;
            }
            &.selected {
                a {
                    color: #409eff;
                }
                i {
                    color: #409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover {
            background-color: #f5f5f5;
            .close {
                visibility: inherit;
                cursor: pointer;
                column-rule: #000;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }

    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
</style>