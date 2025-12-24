<script setup>
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  const props = defineProps(['menuData', "index"])
  
  const router = useRouter()
  const store = useStore()

  const handleClick = (item, active) => {
    store.commit('addMenu', item.meta)
    store.commit('updateMenuActive', active)
    router.push(item.meta.path)
  }


</script>

<template>
        <template v-for="(item, index) in props.menuData">
          <el-menu-item 
            @click="handleClick(item, `${props.index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length == 0"
            :index="`${props.index}-${item.meta.id}`"
            :key="`${props.index}-${item.meta.id}`">
            
            <el-icon size="20">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.name }}</span>
          </el-menu-item>

          <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
            <template #title>
              <el-icon size="20">
                <component :is="item.meta.icon"></component>
              </el-icon>
              <span>{{ item.meta.name }}</span>
            </template>
            <tree-menu 
            :index="`${props.index}-${item.meta.id}`"
            :menuData="item.children"
            />
          </el-sub-menu>
        </template>
</template>

<style scoped>

</style>