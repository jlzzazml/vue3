<script setup>
import { artGetDetailService } from '@/api/article'
import { useArticleStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const articleStore = useArticleStore()
const id = ref()
id.value = articleStore.currentArticleID
const defaultParams = {
  id: '',
  title: '',
  content: ''
}
const params = ref({ ...defaultParams })
const getArticleDet = async (id) => {
  // 需要基于 row.id 发送请求，获取编辑对应的详情数据
  try {
    const res = await artGetDetailService(id)
    params.value = res.data.data
  } catch {
    params.value = defaultParams
  }
  console.log(params.value)
}
getArticleDet(id.value)

const router = useRouter()
const goBack = () => {
  router.push('/article/manage')
}

const color1 = ref('#91bc93')

const fontSize = ref('20px')
const fontOptions = [
  {
    value: '30px',
    label: '大号'
  },
  {
    value: '20px',
    label: '中号'
  },
  {
    value: '12px',
    label: '小号'
  }
]
</script>

<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="tit"> {{ params.title }} </span>
    </template>
  </el-page-header>
  <div class="set">
    <div class="demo-color-block">
      <span class="demonstration">背景颜色</span>
      <el-color-picker v-model="color1" />
    </div>
    <el-select v-model="fontSize" placeholder="选择字号" style="width: 80px">
      <el-option
        v-for="item in fontOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
  <div
    class="content"
    :style="{ backgroundColor: color1, fontSize: fontSize }"
    v-html="params.content"
  ></div>
</template>

<style scoped>
.tit {
  margin-left: 300px;
  font-size: 30px;
}
.set {
  width: 800px;
  margin: 10px auto;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
}
.content {
  margin: 0 auto;
  margin-top: 20px;
  width: 900px;
  height: 350px;
  overflow-y: auto;
  border: 2px solid rgb(79, 194, 233);
}
.demo-color-block {
  display: flex;
  align-items: center;
}
.demo-color-block .demonstration {
  margin-right: 16px;
}
</style>
