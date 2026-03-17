<script setup>
import { artGetDetailService } from '@/api/article'
import { baseURL } from '@/utils/request'
import { onMounted, ref } from 'vue'
const props = defineProps(['artId'])
const imgUrl = ref()
const loading = ref(true)
const getImgUrl = async (id) => {
  // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
  try {
    const res = await artGetDetailService(id)
    // 图片需要单独处理回显
    imgUrl.value = baseURL + res.data.data.cover_img
  } catch (error) {
    console.log('加载图片失败', error)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getImgUrl(props.artId)
})
</script>

<template>
  <div class="one">
    <div v-if="loading" class="avatar">加载中...</div>
    <img v-else :src="imgUrl" class="avatar" loading="lazy" />
    <slot name="articleTitle"></slot>
    <slot name="button"></slot>
  </div>
</template>

<style scoped>
.one {
  width: 100%; /* 占满整个网格单元格 */
  /* min-width: 0; 防止内容溢出 */
  padding: 30px;
  text-align: center;
  box-sizing: border-box; /* 让padding和border不增加宽度 */
}
.avatar {
  display: block;
  height: 100px;
  width: 100%;
}
</style>
