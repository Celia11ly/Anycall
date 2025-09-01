<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <h2>AnyCall管理后台</h2>
        <p>欢迎登录管理系统</p>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
        </el-form-item>
        <div class="register-link">
          <span>还没有账号？</span>
          <el-link type="primary" @click="handleRegister">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref()
const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

// 模拟登录验证
function handleLogin() {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟登录成功
      // 在实际应用中，这里应该调用API进行登录验证
      const { username, password } = loginForm.value
      
      // 简单的模拟验证，实际项目中应该调用后端API
      if (username === 'admin' && password === 'admin123') {
        // 存储登录信息到localStorage
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('userInfo', JSON.stringify({ username: 'admin' }))
        
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    }
  })
}

function handleRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-container {
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #1890ff;
  margin-bottom: 10px;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}
</style>