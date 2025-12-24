<script setup>
    import { ref, reactive, computed, toRaw } from 'vue';
    import { UserFilled, Lock } from '@element-plus/icons-vue';
    import { userAuthentication, login, menuPermissions } from '../../api'
    import { ElMessage } from 'element-plus';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex'

    // 表单数据
    const loginForm = reactive({
        userName: '',
        passWord: '',
    })

    // 切换表单(0登录 1注册)
    const formType = ref(0)

    // 账号校验规则
    const validateUser = (rule, value, callback) => {
        // 不能为空
        if (value === '') {
            callback(new Error('请输入账号'))
        }
        else {
            const phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
            phoneReg.test(value) ? callback() : callback(new Error('手机号格式错误, 请输入正确的手机号'))
        }
    }

    // 密码校验规则
    const validatePass = (rule, value, callback) => {
        // 不能为空
        if (value === '') {
            callback(new Error('请输入密码'))
        }
        else {
            const Reg = /^[a-zA-Z0-9_-]{4,16}$/
            Reg.test(value) ? callback() : callback(new Error('密码格式错误, 请输入正确的密码'))
        }
    }

    // 表单校验
    const rules = reactive({
        userName: [{ validator: validateUser, trigger: 'blur'}],
        passWord: [{ validator: validatePass, trigger: 'blur'}]
    })

    // 点击切换登录和注册
    const handleChange = () => {
        formType.value = formType.value ? 0 : 1
    }


    let flag = false

    const loginFormRef = ref()

    const store = useStore()

    const routerList = computed(() => store.state.menu.routerList)

    // 表单提交
    const submitForm = async (formEl) => {
        if (!formEl) return
        // 手动触发校验
        await formEl.validate((valid, fields) => {
            if (valid) {

                // 注册页面
                if (formType.value) {
                    userAuthentication(loginForm).then(({ data }) => {
                        
                        if (data.code === 10000) {
                            ElMessage.success('注册成功, 请登录')
                            formType.value = 0
                        }
                    }) 
                }
                // 登录页面
                else {
                    login(loginForm).then(({ data }) => {
                        if (data.code === 10000) {
                            ElMessage.success('登录成功!')
                            //将token和用户信息缓存到浏览器
                            localStorage.setItem('pzv2_token', data.data.token)
                            localStorage.setItem('pzv2_userInfo', JSON.stringify(data.data.userInfo))
                            menuPermissions().then(({data}) => {
                                store.commit('dynamicMenu', data.data)
                                localStorage.setItem('pzv2_v3pz', JSON.stringify(data.data))
                                toRaw(routerList.value).forEach(item => {
                                    router.addRoute('main', item)
                                })
                                router.push('/')
                            })
                            //router.push('/')
                        }
                    })
                }
            }
            else {
                console.log('error submit!', fields)
            }
        })
    }

    const router = useRouter()

</script>


<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img src="/login-head.png" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? "返回登录" : "注册账号" }}</el-link>                
            </div>
            <el-form 
                ref="loginFormRef"
                :model="loginForm"
                style="max-width: 600px"
                class="demo-ruleForm"
                :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :style="{width: '100%'}" @click="submitForm(loginFormRef)" >
                        {{ formType ? '注册账号' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<style lang="less" scoped>

    :deep(.el-card__header) {
        padding: 0;
    }
    .login-container {
        height: 100%;
        .card-header {
            background-color: #899fe1;
            img {
                width: 430px;
            }
        }
        .jump-link {
            text-align: right;
            margin-bottom: 10px;
        }
    }

</style>