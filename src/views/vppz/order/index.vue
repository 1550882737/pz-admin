<script setup>
    import { onMounted, ref, reactive } from 'vue';
    import { orderList, updateOrder } from '../../../api'
    import { useRoute } from 'vue-router';

    const route = useRoute()

    const orderListData = reactive({
        pageNum: 1,
        pageSize: 10
    })

    const listData = reactive({})

    // 获取订单数据
    const getListData = () => {
        orderList(orderListData).then(({ data }) => {
            Object.assign(listData, data.data)
            console.log(listData);
        })
    }

    // 根据状态映射标签类型
    const getStatusType = (status) => {
        const statusMap = {
            '已取消' : 'info',
            '待服务': 'warning',
            '已完成': 'success',
        }
        return statusMap[status]
    }

    // 服务完成确认
    const serviceConfirm = (id) => {
        updateOrder({ id }).then(({ data }) => {
            if (data.code === 10000) {
                getListData()
            }
        })
    }

    // 切换页码
    const handleCurrentChange = (newPageNum) => {
        orderListData.pageNum = newPageNum
        getListData()
    }

    // 查询功能的输入框内容
    const search_no = ref()

    // 根据订单号查询
    const searchConfirm = () => {
        const params = {
            pageNum: orderListData.pageNum,
            pageSize: orderListData.pageSize,
            out_trade_no: search_no.value
        }

        orderList(params).then(({ data }) => {
            Object.assign(listData, data.data)
            console.log(listData);
        })
    }
    

    onMounted(() => {
        getListData()
    })
</script>

<template>
    <div class="container">
        <panel-head :route="route"/>
        <div class="search">
            <el-input v-model="search_no" style="width: 240px" placeholder="订单号" />
            <el-button type="primary" style="margin-left: 12px;" @click="searchConfirm()">查询</el-button>
        </div>

        <el-table :data="listData.list" style="width: 100%;" :scrollbar-always-on="true">
            <el-table-column fixed prop="out_trade_no" label="订单号" />
            <el-table-column prop="hospital_name" label="就诊医院" />
            <el-table-column label="陪诊师头像" >
                <template #default="scope">
                    <el-image 
                        :src="scope.row.companion.avatar"
                        style="width: 50px; height: 50px;"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="companion.mobile" label="陪诊师手机号" />
            <el-table-column prop="price" label="总价" />
            <el-table-column prop="paidPrice" label="已付" />
            <el-table-column prop="starttime" label="下单时间" />
            <el-table-column prop="trade_state" label="订单状态" >
                <template #default="scope">
                    <el-tag
                        :type="getStatusType(scope.row.trade_state)"
                        effect="light"
                        class="status-tag"
                    >
                        {{ scope.row.trade_state }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="service_state" label="接单状态" />
            <el-table-column prop="client.mobile" label="联系人手机号" />
            <el-table-column label="操作"  fixed="right">
                <template #default="scope">
                    <el-button type="primary" v-if="scope.row.trade_state == '已取消'" disabled>暂无服务</el-button>
                    <el-button type="primary" v-if="scope.row.trade_state == '已完成'" disabled>暂无服务</el-button>

                    <el-popconfirm 
                        title="服务是否已完成？"
                        v-else-if="scope.row.trade_state == '待服务'"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        @confirm="serviceConfirm(scope.row.out_trade_no)"
                    >
                        <template #reference>
                            <el-button type="primary" >服务完成</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-info">
        <el-pagination
            v-model:current-page="orderListData.pageNum"
            :page-size="orderListData.pageSize"
            :background="false"
            layout="total, prev, pager, next"
            :total="listData.total"
            @current-change="handleCurrentChange"
        />
    </div>
    </div>

</template>

<style lang="less" scoped>
    .container {
        display: flex;
        flex-direction: column;
        overflow-x: auto;
        width: 100%;
    }

    .search {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
        margin-bottom: 16px;
    }
</style>