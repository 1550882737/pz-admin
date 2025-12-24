<script setup>
    import { ref, reactive, onMounted, nextTick} from 'vue';
    import { menuList, userGetMenu, userSetMenu } from '../../../api';
    import { Plus } from '@element-plus/icons-vue';
    import { useRoute } from 'vue-router';

    const route = useRoute()
    
    onMounted(() => {
        // 菜单数据
        userGetMenu().then(({ data }) => {
            // console.log(data);
            permissionData.value = data.data  
        })
        getListData()
    })

    // 列表数据
    const tableData = reactive({
        list: [],
        total: 0
    })

    // 打开弹窗
    const open = (rowData = {}) => {
        dialogFormVisable.value = true
        nextTick(() => {
            if (rowData) {
                Object.assign(form, { id:rowData.id, name:rowData.name})
                setTimeout(() => {
                    if (treeRef.value && rowData.permission) {
                        treeRef.value.setCheckedKeys(rowData.permission)
                    }
                }, 100)
            }
        })
    }

    const menuListData = reactive({
        pageNum: 1,
        pageSize: 10
    })

    const handleSizeChange = (val) => {
        menuListData.pageSize = val
        getListData()
    }

    const handleCurrentChange = (val) => {
        menuListData.pageNum = val
        getListData()
    }

    // 请求列表数据
    const getListData = () => {
        menuList(menuListData).then(({ data }) => {
            const {list, total} = data.data
            tableData.list = list
            tableData.total = total
        })
    }

    const formRef = ref()

    // 树形菜单权限数据
    const permissionData = ref([])

    // 弹窗数据
    const form = reactive({
        name: '',
        permission: ''
    })

    // 弹窗的显示隐藏
    const dialogFormVisable = ref(false)

    // 关闭弹窗的回调
    const beforeClose = () => {
        dialogFormVisable.value =false
        // 重置表单
        formRef.value.resetFields()
        // 选择重置
        treeRef.value.setCheckedKeys([4,5])
    }

    const treeRef = ref()

    // 表单校验规则
    const rules = reactive({
        name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }]
    })

    // 表单提交
    const confirm = async(formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
                userSetMenu({ name: form.name, permissions}).then(({ data }) => {
                    //console.log(data)
                    beforeClose()
                    getListData()
                })
            }
            else {
                console.log('error submit!', fields)
            }
        })
    }
</script>

<template>
    <panel-head :route="route"/>
    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)">新增</el-button>
    </div>

    <el-table :data="tableData.list" style="width: 100%;">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" width="500px"/>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
            v-model:currentPage="menuListData.pageNum"
            :page-size="menuListData.pageSize"
            :background="false"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
    <el-dialog 
        v-model="dialogFormVisable"
        :before-close="beforeClose"
        title="添加权限"
        width="500px"
    >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
            :rules="rules"
        >   
            <el-form-item prop="id" v-show="false">
                <el-input v-model="form.id" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称"/>
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree 
                    v-if="dialogFormVisable"
                    ref="treeRef"
                    style="max-width: 600px;"
                    :data="permissionData"
                    node-key="id"
                    show-checkbox
                    :default-checked-keys="[4,5]"
                    :default-expanded-keys="[2]"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>

</style>