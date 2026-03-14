<script setup>
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import {
  CaretBottom,
  Crop,
  EditPen,
  Menu,
  Promotion,
  Setting,
  SwitchButton,
  User,
  UserFilled,
  View
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  userStore.getUser()
})

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}
const newAppearColor = ref({
  asideColor: '#649884',
  headerColor: '#94baa9'
})
const changeAppear = (newvalue) => {
  newAppearColor.value = newvalue
}
</script>

<template>
  <!-- 
    el-menu 整个菜单组件
      :default-active="$route.path"  配置默认高亮的菜单项
      router  router选项开启，el-menu-item 的 index 就是点击跳转的路径

    el-menu-item 菜单项
      index="/article/channel" 配置的是访问的跳转路径，配合default-active的值，实现高亮
  -->
  <el-container class="layout-container">
    <el-aside
      width="200px"
      class="el-aside"
      :style="{ backgroundColor: newAppearColor.asideColor }"
    >
      <div class="el-aside-title">个人日记管理平台</div>
      <el-menu
        active-text-color="#ffd04b"
        :default-active="$route.path"
        text-color="#fff"
        :background-color="newAppearColor.asideColor"
        :popper-background-color="newAppearColor.asideColor"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Menu /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>日记管理</span>
        </el-menu-item>
        <el-menu-item index="/article/show">
          <el-icon><View /></el-icon>
          <span>日记展示</span>
        </el-menu-item>

        <el-sub-menu index="/user">
          <!-- 多级菜单的标题 - 具名插槽 title -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <!-- 展开的内容 - 默认插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/appear">
            <el-icon><Setting /></el-icon>
            <span>外观设置</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header :style="`backgroundColor:${newAppearColor.headerColor}`">
        <div>
          用户：<strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 展示给用户，默认看到的 -->
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>

          <!-- 折叠的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="appear" :icon="Setting"
                >外观设置</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view @change-appear="changeAppear"></router-view>
      </el-main>
      <el-footer>
        <div>created by JMC 2026-03</div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    // background-color: #065235;
    .el-aside-title {
      height: 20vh;
      text-align: center;
      line-height: 20vh;
      font-size: 20px;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    // background-color: #158d59;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
    height: 50px;
  }
}
</style>
