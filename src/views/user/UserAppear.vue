<script setup>
import { useAppearStore } from '@/stores'

const appearStore = useAppearStore()
const resetAsideColor = () => {
  appearStore.currentAppear.asideColor = '#649884'
}
const resetHeaderColor = () => {
  appearStore.currentAppear.headerColor = '#94baa9'
}
</script>

<template>
  <page-container title="外观设置">
    <div class="content">
      <div class="demo-color-block">
        <span>侧边栏背景颜色</span>
        <el-color-picker v-model="appearStore.currentAppear.asideColor" />
        <el-button type="primary" @click="resetAsideColor">重置颜色</el-button>
      </div>
      <div class="demo-color-block">
        <span>头部导航栏背景颜色</span>
        <el-color-picker v-model="appearStore.currentAppear.headerColor" />
        <el-button type="primary" @click="resetHeaderColor">重置颜色</el-button>
      </div>
    </div>
  </page-container>
</template>

<style scoped>
.content {
  padding: 20px;
}
.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}
</style>
