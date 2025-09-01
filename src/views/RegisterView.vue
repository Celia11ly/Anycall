<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>创建您的AnyCall管理账户</p>
      </div>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" class="register-button">注册</el-button>
        </el-form-item>
        <div class="login-link">
          <span>已有账号？</span>
          <el-link type="primary" @click="handleLogin">返回登录</el-link>
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
const registerFormRef = ref()
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const registerRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

function handleRegister() {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟注册成功
      // 在实际应用中，这里应该调用API进行注册
      const { username, password } = registerForm.value
      
      // 简单的模拟注册，实际项目中应该调用后端API
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    }
  })
}

function handleLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.register-container {
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #1890ff;
  margin-bottom: 10px;
}

.register-form {
  width: 100%;
}

.register-button {
  width: 100%;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}
</style>