<template>
  <div class="role-management">
    <div class="page-header">
      <h1>角色管理</h1>
      <p>创建和管理系统中的虚拟角色</p>
    </div>
    
    <!-- 创建角色表单 -->
    <el-card class="create-role-card">
      <template #header>
        <div class="card-header">
          <span>创建角色</span>
        </div>
      </template>
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" class="role-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="角色姓名" prop="name">
              <el-input v-model="roleForm.name" placeholder="请输入角色姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="roleForm.gender" placeholder="请选择性别">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用语种" prop="language">
              <el-select v-model="roleForm.language" placeholder="请选择使用语种">
                <el-option label="中文" value="zh-CN" />
                <el-option label="英文" value="en-US" />
                <el-option label="日文" value="ja-JP" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="人设描述" prop="description">
              <el-input v-model="roleForm.description" type="textarea" placeholder="请输入角色的人设描述" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="头像上传" prop="avatar">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
                ref="avatarUploadRef"
              >
                <img v-if="roleForm.avatar" :src="roleForm.avatar" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-button type="text" @click="handleAvatarClick">选择图片</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="声音文件" prop="voiceFile">
              <el-upload
                class="voice-uploader"
                action="#"
                :show-file-list="true"
                :on-success="handleVoiceSuccess"
                :before-upload="beforeVoiceUpload"
                :auto-upload="false"
                ref="voiceUploadRef"
                accept=".mp3,.wav"
              >
                <el-button type="primary">点击上传</el-button>
              </el-upload>
              <div v-if="voiceFileName" class="voice-file-name">
                <el-tag>{{ voiceFileName }}</el-tag>
                <el-button type="text" size="small" @click="removeVoiceFile">移除</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="form-actions">
            <el-button type="primary" @click="handleCreateRole">创建角色</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <!-- 表格导入 -->
    <div class="import-section">
      <el-card class="import-card">
        <template #header>
          <div class="card-header">
            <span>批量导入</span>
          </div>
        </template>
        <div class="import-content">
          <el-upload
            class="import-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleImportSuccess"
            :before-upload="beforeImportUpload"
            :auto-upload="false"
            ref="importUploadRef"
            accept=".xlsx,.xls,.csv"
          >
            <el-button type="primary">上传表格文件</el-button>
          </el-upload>
          <el-button type="text" @click="downloadTemplate">下载导入模板</el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 角色列表 -->
    <el-card class="role-list-card">
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索角色姓名"
            prefix-icon="Search"
            style="width: 200px; margin-left: 20px;"
          />
        </div>
      </template>
      <el-table :data="filteredRoles" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色姓名" width="120" />
        <el-table-column prop="description" label="人设描述" show-overflow-tooltip />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            <span>{{ scope.row.gender === 'male' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="language" label="使用语种" width="100">
          <template #default="scope">
            <span>{{ getLanguageLabel(scope.row.language) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="头像" width="100">
          <template #default="scope">
            <img :src="scope.row.avatar" class="table-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditRole(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleDeleteRole(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredRoles.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 编辑角色对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑角色" width="700px">
      <el-form ref="editFormRef" :model="editForm" :rules="roleRules" class="edit-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色姓名" prop="name">
              <el-input v-model="editForm.name" placeholder="请输入角色姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="editForm.gender" placeholder="请选择性别">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="使用语种" prop="language">
              <el-select v-model="editForm.language" placeholder="请选择使用语种">
                <el-option label="中文" value="zh-CN" />
                <el-option label="英文" value="en-US" />
                <el-option label="日文" value="ja-JP" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="人设描述" prop="description">
              <el-input v-model="editForm.description" type="textarea" placeholder="请输入角色的人设描述" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleEditAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
                ref="editAvatarUploadRef"
              >
                <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-button type="text" @click="handleEditAvatarClick">选择图片</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoleStore } from '../store'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const roleStore = useRoleStore()

// 创建角色表单相关
const roleFormRef = ref()
const avatarUploadRef = ref()
const voiceUploadRef = ref()
const roleForm = ref({
  name: '',
  description: '',
  gender: '',
  language: '',
  avatar: '',
  voiceFile: null
})
const voiceFileName = ref('')

// 表单验证规则
const roleRules = ref({
  name: [
    { required: true, message: '请输入角色姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '角色姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入人设描述', trigger: 'blur' },
    { min: 10, max: 500, message: '人设描述长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  language: [
    { required: true, message: '请选择使用语种', trigger: 'change' }
  ]
})

// 导入相关
const importUploadRef = ref()

// 角色列表相关
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 编辑角色相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editAvatarUploadRef = ref()
const editForm = ref({
  id: '',
  name: '',
  description: '',
  gender: '',
  language: '',
  avatar: ''
})

// 过滤后的角色列表
const filteredRoles = computed(() => {
  if (!searchKeyword.value) {
    return roleStore.roles
  }
  return roleStore.roles.filter(role => 
    role.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 分页相关方法
function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
}

function handleCurrentChange(current) {
  currentPage.value = current
}

// 上传相关方法
function handleAvatarClick() {
  avatarUploadRef.value.$el.querySelector('input').click()
}

function handleAvatarSuccess(response, file) {
  // 模拟上传成功，实际项目中应该根据后端返回设置头像URL
  const url = URL.createObjectURL(file.raw)
  roleForm.value.avatar = url
}

function beforeAvatarUpload(file) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB！')
    return false
  }
  return true
}

function handleVoiceSuccess(response, file) {
  // 模拟上传成功
  voiceFileName.value = file.name
  roleForm.value.voiceFile = file
}

function beforeVoiceUpload(file) {
  const isAudio = ['audio/mpeg', 'audio/wav'].includes(file.type)
  if (!isAudio) {
    ElMessage.error('只能上传MP3或WAV文件！')
    return false
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('上传声音文件大小不能超过 10MB！')
    return false
  }
  return true
}

function removeVoiceFile() {
  voiceFileName.value = ''
  roleForm.value.voiceFile = null
}

// 角色操作方法
function handleCreateRole() {
  roleFormRef.value.validate((valid) => {
    if (valid) {
      // 创建角色
      roleStore.addRole({
        name: roleForm.value.name,
        description: roleForm.value.description,
        gender: roleForm.value.gender,
        language: roleForm.value.language,
        avatar: roleForm.value.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + roleForm.value.name,
        voiceId: 'voice' + Date.now()
      })
      
      ElMessage.success('角色创建成功')
      resetForm()
    }
  })
}

function resetForm() {
  roleFormRef.value.resetFields()
  roleForm.value.avatar = ''
  removeVoiceFile()
}

function handleEditRole(role) {
  editForm.value = { ...role }
  editDialogVisible.value = true
}

function handleEditAvatarClick() {
  editAvatarUploadRef.value.$el.querySelector('input').click()
}

function handleEditAvatarSuccess(response, file) {
  const url = URL.createObjectURL(file.raw)
  editForm.value.avatar = url
}

function handleUpdateRole() {
  editFormRef.value.validate((valid) => {
    if (valid) {
      roleStore.updateRole(editForm.value.id, editForm.value)
      ElMessage.success('角色更新成功')
      editDialogVisible.value = false
    }
  })
}

function handleDeleteRole(id) {
  ElMessageBox.confirm('确定要删除这个角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    roleStore.deleteRole(id)
    ElMessage.success('角色删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 导入导出相关
function handleImportSuccess(response, file) {
  // 模拟导入成功
  ElMessage.success('表格导入成功')
}

function beforeImportUpload(file) {
  const isExcel = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(file.type)
  if (!isExcel) {
    ElMessage.error('只能上传Excel或CSV文件！')
    return false
  }
  return true
}

function downloadTemplate() {
  // 模拟下载模板
  ElMessage.success('模板下载成功')
}

// 辅助方法
function getLanguageLabel(language) {
  const languages = {
    'zh-CN': '中文',
    'en-US': '英文',
    'ja-JP': '日文'
  }
  return languages[language] || language
}

onMounted(() => {
  // 初始化时的操作
})
</script>

<style scoped>
.role-management {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.page-header p {
  color: #606266;
}

.create-role-card,
.import-section,
.role-list-card {
  margin-bottom: 30px;
}

.role-form {
  padding: 20px 0;
}

.form-actions {
  text-align: right;
  padding-top: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #909399;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
}

.voice-file-name {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.import-content {
  padding: 20px 0;
  display: flex;
  gap: 20px;
}

.table-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.edit-form {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .el-row .el-col {
    width: 100%;
  }
}
</style>