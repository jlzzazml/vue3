<script setup>
import { ref } from 'vue'

const appearColor = ref({
  asideColor: '#649884',
  headerColor: '#94baa9'
})
const emit = defineEmits(['changeAppear'])
const handleColorChange = () => {
  emit('changeAppear', appearColor.value)
}
</script>

<template>
  <page-container title="外观设置">
    <div class="content">
      <div class="demo-color-block">
        <span class="demonstration">侧边栏背景颜色</span>
        <el-color-picker
          v-model="appearColor.asideColor"
          @change="handleColorChange"
        />
      </div>
      <div class="demo-color-block">
        <span class="demonstration">头部导航栏背景颜色</span>
        <el-color-picker
          v-model="appearColor.headerColor"
          @change="handleColorChange"
        />
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
}
.demo-color-block .demonstration {
  margin-right: 16px;
}
</style>
