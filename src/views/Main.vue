<template>
  <div class="common-layout">
    <el-container>
      <!--el-aside width="200px">Aside</!--el-aside-->
      <Aside />
      <el-container>
        <el-header><Header /></el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script setup>
    import Aside from '../components/aside.vue'
    import Header from '../components/navHeader.vue'
</script>

<style lang="less" scoped>

    .common-layout {
      background-color: #f0f2f5; 
        height: 100%;
        .el-container {
            height: 100%;
        }

        :deep(.el-main) {
            border-radius: 5px;
            background-color: #ffffff; 
            margin: 18px;              
            overflow: hidden;          
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); 
        }
    }

</style>