<script setup>
import { artGetDetailService } from '@/api/article'
import { useArticleStore } from '@/stores'
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
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

const input = ref('')
const newContent = ref('')
let timer = null
const searchText = () => {
  if (timer) {
    clearTimeout(timer)
  } else {
    timer = setTimeout(() => {
      newContent.value = params.value.content.replaceAll(
        input.value,
        `<span style="background-color:yellow">${input.value}</span>`
      )
    }, 2000)
    timer = null
  }
}
// 使用计算属性决定显示内容
const displayContent = computed(() => {
  // 如果有搜索词，且正在防抖期间，显示原内容
  // 如果搜索完成且有高亮内容，显示高亮内容
  return input.value
    ? newContent.value || params.value.content
    : params.value.content
})
</script>

<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="tit"> {{ params.title }} </span>
    </template>
  </el-page-header>
  <div class="set">
    <div class="demo">
      <span class="demonstration">背景颜色</span>
      <el-color-picker v-model="color1" />
    </div>
    <div class="demo">
      <span class="demonstration">字号</span>
      <el-select v-model="fontSize" placeholder="选择字号" style="width: 80px">
        <el-option
          v-for="item in fontOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-input
      v-model="input"
      style="width: 240px"
      placeholder="全文搜索"
      :suffix-icon="Search"
      clearable
      @input="searchText"
    />
  </div>
  <div
    class="content"
    :style="{ backgroundColor: color1, fontSize: fontSize }"
    v-html="displayContent"
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
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
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
.demo {
  display: flex;
  align-items: center;
}
.demonstration {
  margin-right: 16px;
}
</style>
