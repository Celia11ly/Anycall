<template>
  <div class="app">
    <el-container v-if="isLoggedIn">
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>AnyCall管理后台</h2>
        </div>
        <el-menu :default-active="activeMenu" class="menu" @select="handleMenuSelect" router>
          <el-menu-item index="/dashboard">
            <el-icon><PieChart /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/role">
            <el-icon><User /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/voice">
            <el-icon><Mic /></el-icon>
            <span>声音管理</span>
          </el-menu-item>
          <el-menu-item index="/recommend">
            <el-icon><Star /></el-icon>
            <span>推荐管理</span>
          </el-menu-item>
        </el-menu>
        <div class="logout">
            <el-button type="text" @click="handleLogout">
              <span>退出登录</span>
            </el-button>
          </div>
      </el-aside>
      <el-container class="main-container">
        <el-header class="header">
          <div class="user-info">
            <span>欢迎，{{ userInfo.username }}</span>
          </div>
        </el-header>
        <el-main class="content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <div v-else class="login-container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from './store'
import { PieChart, User, Mic, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const store = useMainStore()
const isLoggedIn = ref(false)
const userInfo = ref({ username: '' })
const activeMenu = ref('')

onMounted(() => {
  checkLoginStatus()
})

function checkLoginStatus() {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('userInfo')
  if (token && user) {
    isLoggedIn.value = true
    userInfo.value = JSON.parse(user)
    activeMenu.value = route.path
  } else {
    isLoggedIn.value = false
    router.push('/login')
  }
}

function handleMenuSelect(key) {
  activeMenu.value = key
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  router.push('/login')
  ElMessage.success('退出登录成功')
}
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.sidebar {
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #40556e;
  text-align: center;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

.menu {
  flex: 1;
  border-right: none;
  background-color: #304156;
}

.menu .el-menu-item {
  color: #fff;
}

.menu .el-menu-item.is-active {
  background-color: #1890ff;
}

.logout {
  padding: 20px;
  border-top: 1px solid #40556e;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
</style>