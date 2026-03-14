<script setup>
import { artDelService, artGetListService } from '@/api/article.js'
import { useArticleStore } from '@/stores'
import { formatTime } from '@/utils/format.js'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleEdit from './components/ArticleEdit.vue'
import ChannelSelect from './components/ChannelSelect.vue'
import FigView from './components/FigView.vue'
const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数
const viewToggle = ref(true)

const toggle = () => {
  viewToggle.value = !viewToggle.value
}
// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '',
  state: ''
})

// 基于params参数，获取文章列表
const getArticleList = async () => {
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  // 获得文章id，后面可以用来发文章详情请求
  // articleList.value.forEach((item) => console.log(item.id))
}
getArticleList()

// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率已经不在原来那一页了
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页 和 每页条数，渲染数据
  getArticleList()
}
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页，渲染数据
  getArticleList()
}

// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 // 重置页面
  getArticleList()
}

// 重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1 // 重置页面
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  // 提示用户是否要删除
  await ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  // 重新渲染列表
  getArticleList()
}

// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数，再渲染
    params.value.pagenum = lastPage
  }

  getArticleList()
}
const router = useRouter()
const articleStore = useArticleStore()
const goToArtShow = (id) => {
  router.push('/article/show')
  articleStore.setCurrentArticle(id)
  console.log(id)
}
</script>

<template>
  <page-container title="日记管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加日记</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="日记分类:">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <!-- 自己把分类写死，params.cate_id不能自己乱写，要发请求给接口获得 -->
        <channel-select
          v-model="params.cate_id"
          placeholder="请选择"
          style="width: 120px"
        >
        </channel-select>
        <!-- 本来是想要自己写死日记分类的，但是不同用户日记分类id应该是不同的，所以没法改，必须后端改接口才可以 -->
        <!-- <el-select
          v-model="params.cate_id"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option label="议论文" value="15083"></el-option>
          <el-option label="记叙文" value="15084"></el-option>
          <el-option label="抒情文" value="15085"></el-option>
        </el-select> -->

        <!-- Vue3 => v-model:cid  :cid 和 @update:cid 的简写 -->
        <!-- <channel-select v-model:cid="params.cate_id"></channel-select> -->
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select
          v-model="params.state"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="toggle">切换视图</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-if="viewToggle" :data="articleList">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link
            type="primary"
            :underline="false"
            @click="goToArtShow(row.id)"
            >{{ row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- articleList -->
    <div
      v-else
      class="pigView"
      :style="{
        gridTemplateColumns: `repeat(${
          params.pagesize === 10 ? 5 : params.pagesize
        }, minmax(150px, 1fr))`
      }"
    >
      <Fig-View v-for="item in articleList" :key="item.id" :artId="item.id">
        <template #articleTitle>
          <el-link
            type="primary"
            :underline="false"
            class="titStyle"
            @click="goToArtShow(item.id)"
            >{{ item.title }}</el-link
          >
        </template>
        <template #button>
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(item)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(item)"
          ></el-button>
        </template>
      </Fig-View>
    </div>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style scoped>
.pigView {
  display: grid;
  justify-items: center;
  align-items: center;
  padding: 50px;
  border: 1px solid pink;
  min-height: 200px;
}
.titStyle {
  display: block;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 16px;
}
:deep(.titStyle span) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
