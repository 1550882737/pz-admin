<script setup>
    import { reactive, ref, onMounted, nextTick } from 'vue'
    import { InfoFilled, Plus, Delete } from '@element-plus/icons-vue';
    import { photoList, companion, companionList, deleteCompanion, uploadApi} from '../../../api'
    import { useRoute } from 'vue-router';

    const route = useRoute()

    const dialogFormVisable = ref(false)

    const menuListData = reactive({
        pageNum: 1,
        pageSize: 10
    })

    // 列表数据
    const tableData = reactive({
        list: [],
        total: 0
    })

    const getListData = () => {
        companionList(menuListData).then(( { data }) => {
            const { list, total} = data.data
            tableData.list = list
            tableData.total = total     
        }) 
         
    }

    // 选择头像弹窗
    const dialogImgVisable = ref(false)
    const filelist = ref([])
    const selectIndex = ref(0)

    const uploadAvatar = async (options) => {
        const file = options.file

        const formData = new FormData()
        formData.append('file', file)

        try {
            const { data } = await uploadApi(formData)

            if (data.code === 10000) {
                form.avatar = data.data.url
                ElMessage.success('上传成功')
            } else {
                ElMessage.error(data.message)
            }
        } catch (error) {
            console.error(error)
            ElMessage.error('上传失败')
        }
    }
    const confirmImage = () => {
        form.avatar = filelist.value[selectIndex.value].url
        dialogImgVisable.value = false
    }

    const beforeClose = () => {
        dialogFormVisable.value = false
        formRef.value.resetFields()
    }

    onMounted(() => {
        photoList().then(({ data }) => {
            filelist.value = data.data
        })
        getListData()
        
    })

    const formRef = ref()
    const form = reactive({
        id: '',
        mobile: '',
        active: 1,
        age: 18,
        avatar: '',
        name: '',
        sex: ''
    })

    const rules = reactive({
        name: [{ required: true, trigger: 'blur', message: '请填写名称'}],
        avatar: [{ required: true, message: '请选择头像'}],
        sex: [{ required: true, trigger: 'change', message: '请选择性别'}],
        mobile: [{ required: true, trigger: 'blur', message: '请填写手机号'}],
    })

    // 确认陪护师添加/编辑
    const confirm = async(formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                companion(form).then(({ data }) => {
                    if (data.code === 10000) {
                        const message = form.id ? '编辑成功' : '新增成功';
                        ElMessage.success(message)
                        beforeClose()
                        getListData()
                    }
                    else {
                        ElMessage.error(data.message)
                    }
                }).catch(error => {
                    console.error('操作失败:', error);
                    ElMessage.error('操作失败，请稍后重试')
                })
            }
            else {
                console.log('验证失败!', fields)
            }
        })
    }

    const open = (rowData) => {
        dialogFormVisable.value = true
        nextTick(() => {
            // 重置表单
            formRef.value.resetFields();
            
            // 如果是编辑，将数据填入表单
            if (rowData && rowData.id) {
                Object.assign(form, rowData)
            } else {
                // 新增时，重置表单为初始值
                Object.keys(form).forEach(key => {
                    if (key === 'active') {
                        form[key] = 1; // 默认生效
                    } else if (key === 'age') {
                        form[key] = 18; // 默认年龄
                    } else {
                        form[key] = '';
                    }
                });
            }
        }) 
    }

    // 勾选的数据
    const selectTableData = ref([])

    const handlesecletionChange = (val) => {
        selectTableData.value = val
    }

    const confirmEvent = () => {
        // 没有选择数据
        if (!selectTableData.value.length) {
            return ElMessage.warning('请选择至少一项数据')
        }

        deleteCompanion({ id: selectTableData.value }).then(({ data }) =>{
            if (data.code === 10000){
                getListData()
            }
        })
    }
</script>

<template>
    <panel-head :route="route"/>
    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)">新增</el-button>
        <el-popconfirm
            confirm-button-text="是"
            cancel-button-text="否"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否删除?"
            @confirm="confirmEvent"
        >
            <template #reference>
                <el-button :icon="Delete" type="danger">删除</el-button>
            </template>
        </el-popconfirm>
    </div>

    <el-table :data="tableData.list" style="width: 100%;" @selection-change="handlesecletionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column label="头像" >
            <template #default="scope">
                <el-image 
                    :src="scope.row.avatar"
                    style="width: 50px; height: 50px;"
                />
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
            <template #default="scope">
                {{ scope.row.sex === '1' ? '男' : '女' }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="pagination-info">
        <el-pagination
            v-model:current-page="menuListData.pageNum"
            :page-size="menuListData.pageSize"
            :background="false"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @current-change="handleCurrentChange"
        />
    </div>


    <el-dialog 
        v-model="dialogFormVisable"
        :before-close="beforeClose"
        title="陪护师添加"
        width="500px"
    >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
            :rules="rules"
        >
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"/>
            </el-form-item>
            <el-form-item lebel="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称"/>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :http-request="uploadAvatar"
                >
                    <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                    <el-button v-else type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item lebel="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="1"/>
                    <el-option label="女" value="2"/>
                </el-select>
            </el-form-item>
            <el-form-item lebel="年龄" prop="age">
                <el-input-number v-model="form.age" :min="18" :max="50"/>
            </el-form-item>
            <el-form-item lebel="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号"/>
            </el-form-item>
            <el-form-item lebel="是否生效" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio :value="0">失效</el-radio>
                    <el-radio :value="1">生效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog 
        v-model="dialogImgVisable"
        title="选择图片"
        width="680px"
    >
        <div class="image-list">
            <div v-for="(item, index) in filelist" :key="index" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="efff"><Check /></el-icon>
                </div>
                <el-image 
                    style="width: 148px; height: 148px;"
                    :src="item.url"
                />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogImgVisable = false">取消</el-button>
                <el-button type="primary" @click="confirmImage()">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
    .btns {
        padding: 10px 0 10px 10px;
        background-color: #fff;
    }

    .avatar {
        width: 100px;
        height: 100px;
        object-fit: cover;   /* 关键：裁剪不变形 */
        border-radius: 6px;
    }

    .image-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .img-box {
            position: relative;
            .select {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 24px;
                height: 24px;
                background-color: #67c23a;
                z-index: 999;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .el-image {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
</style>