<template>
  <div class="recommend-management">
    <div class="page-header">
      <h1>推荐管理</h1>
      <p>设置和管理推荐的角色</p>
    </div>
    
    <!-- 设置推荐角色 -->
    <el-card class="set-recommend-card">
      <template #header>
        <div class="card-header">
          <span>设置推荐角色</span>
        </div>
      </template>
      <el-form ref="recommendFormRef" :model="recommendForm" :rules="recommendRules" class="recommend-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="角色ID" prop="roleId">
              <el-input v-model="recommendForm.roleId" placeholder="请输入角色ID" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通话次数" prop="callCount">
              <el-input v-model.number="recommendForm.callCount" placeholder="请输入通话次数" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序序号" prop="order">
              <el-input v-model.number="recommendForm.order" placeholder="请输入排序序号" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="form-actions">
            <el-button type="primary" @click="handleSetRecommend">设置为推荐</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 角色信息预览 -->
      <div v-if="selectedRole" class="role-preview">
        <el-card class="preview-card">
          <div class="preview-content">
            <img :src="selectedRole.avatar" class="preview-avatar" />
            <div class="preview-info">
              <h3>{{ selectedRole.name }}</h3>
              <p>{{ selectedRole.description }}</p>
              <p><span class="label">性别：</span>{{ getGenderLabel(selectedRole.gender) }}</p>
              <p><span class="label">使用语种：</span>{{ getLanguageLabel(selectedRole.language) }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
    
    <!-- 推荐角色列表 -->
    <el-card class="recommend-list-card">
      <template #header>
        <div class="card-header">
          <span>推荐角色列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索角色姓名"
            prefix-icon="Search"
            style="width: 200px; margin-left: 20px;"
          />
        </div>
      </template>
      <el-table :data="filteredRecommendRoles" style="width: 100%">
        <el-table-column prop="order" label="排序序号" width="100" />
        <el-table-column prop="name" label="角色姓名" width="120" />
        <el-table-column prop="avatar" label="头像" width="100">
          <template #default="scope">
            <img :src="scope.row.avatar" class="table-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="callCount" label="通话次数" width="120">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.callCount"
              :min="0"
              @change="handleCallCountChange(scope.row.id, $event)"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditRecommend(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteRecommend(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredRecommendRoles.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 编辑推荐角色对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑推荐角色" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="recommendRules" class="edit-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="角色ID" prop="roleId">
              <el-input v-model="editForm.roleId" placeholder="请输入角色ID" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通话次数" prop="callCount">
              <el-input v-model.number="editForm.callCount" placeholder="请输入通话次数" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序序号" prop="order">
              <el-input v-model.number="editForm.order" placeholder="请输入排序序号" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateRecommend">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRecommendStore, useRoleStore } from '../store'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const recommendStore = useRecommendStore()
const roleStore = useRoleStore()

// 设置推荐角色表单相关
const recommendFormRef = ref()
const recommendForm = ref({
  roleId: '',
  callCount: 0,
  order: 1
})
const selectedRole = ref(null)

// 表单验证规则
const recommendRules = ref({
  roleId: [
    { required: true, message: '请输入角色ID', trigger: 'blur' }
  ],
  callCount: [
    { required: true, message: '请输入通话次数', trigger: 'blur' },
    { type: 'number', min: 0, message: '通话次数不能为负数', trigger: 'blur' }
  ],
  order: [
    { required: true, message: '请输入排序序号', trigger: 'blur' },
    { type: 'number', min: 1, message: '排序序号必须大于0', trigger: 'blur' }
  ]
})

// 推荐角色列表相关
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 编辑推荐角色相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = ref({
  id: '',
  roleId: '',
  callCount: 0,
  order: 1
})

// 过滤后的推荐角色列表
const filteredRecommendRoles = computed(() => {
  if (!searchKeyword.value) {
    return recommendStore.recommendedRoles
  }
  return recommendStore.recommendedRoles.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
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

// 查找角色信息
function findRoleById(roleId) {
  const role = roleStore.roles.find(r => r.id === parseInt(roleId))
  if (role) {
    selectedRole.value = role
  } else {
    selectedRole.value = null
    ElMessage.warning('未找到该角色ID')
  }
}

// 监听角色ID输入变化
watch(() => recommendForm.value.roleId, (newValue) => {
  if (newValue) {
    findRoleById(newValue)
  } else {
    selectedRole.value = null
  }
})

// 推荐角色操作方法
function handleSetRecommend() {
  recommendFormRef.value.validate((valid) => {
    if (valid) {
      // 检查角色是否存在
      const role = roleStore.roles.find(r => r.id === parseInt(recommendForm.value.roleId))
      if (!role) {
        ElMessage.error('未找到该角色ID，请输入正确的角色ID')
        return
      }
      
      // 检查是否已经在推荐列表中
      const existingItem = recommendStore.recommendedRoles.find(item => item.roleId === parseInt(recommendForm.value.roleId))
      if (existingItem) {
        // 更新现有推荐角色
        recommendStore.updateRecommend(existingItem.id, {
          callCount: recommendForm.value.callCount,
          order: recommendForm.value.order
        })
        ElMessage.success('推荐角色更新成功')
      } else {
        // 添加新的推荐角色
        recommendStore.addRecommend({
          roleId: parseInt(recommendForm.value.roleId),
          name: role.name,
          avatar: role.avatar,
          callCount: recommendForm.value.callCount,
          order: recommendForm.value.order
        })
        ElMessage.success('推荐角色设置成功')
      }
      
      resetForm()
    }
  })
}

function resetForm() {
  recommendFormRef.value.resetFields()
  selectedRole.value = null
}

function handleCallCountChange(id, value) {
  if (value === null) return
  recommendStore.updateRecommend(id, { callCount: value })
  ElMessage.success('通话次数更新成功')
}

function handleEditRecommend(item) {
  editForm.value = {
    id: item.id,
    roleId: item.roleId.toString(),
    callCount: item.callCount,
    order: item.order
  }
  editDialogVisible.value = true
}

function handleUpdateRecommend() {
  editFormRef.value.validate((valid) => {
    if (valid) {
      recommendStore.updateRecommend(editForm.value.id, editForm.value)
      ElMessage.success('推荐角色编辑成功')
      editDialogVisible.value = false
    }
  })
}

function handleDeleteRecommend(id) {
  ElMessageBox.confirm('确定要从推荐列表中删除这个角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    recommendStore.deleteRecommend(id)
    ElMessage.success('推荐角色删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 辅助方法
function getGenderLabel(gender) {
  return gender === 'male' ? '男' : '女'
}

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
.recommend-management {
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

.set-recommend-card,
.recommend-list-card {
  margin-bottom: 30px;
}

.recommend-form {
  padding: 20px 0;
}

.form-actions {
  text-align: right;
  padding-top: 20px;
}

.role-preview {
  margin-top: 20px;
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.preview-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.preview-info h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.preview-info p {
  margin: 5px 0;
  color: #606266;
}

.preview-info .label {
  font-weight: bold;
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
@media (max-width: 768px) {
  .preview-content {
    flex-direction: column;
    text-align: center;
  }
  
  .el-row .el-col {
    width: 100%;
  }
}
</style>