<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>仪表盘</h1>
      <p>欢迎来到AnyCall管理后台</p>
    </div>
    
    <div class="dashboard-stats">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">总角色数</p>
            <p class="stat-value">{{ roleCount }}</p>
          </div>
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">总声音数</p>
            <p class="stat-value">{{ voiceCount }}</p>
          </div>
          <div class="stat-icon">
            <el-icon><Mic /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">推荐角色数</p>
            <p class="stat-value">{{ recommendCount }}</p>
          </div>
          <div class="stat-icon">
            <el-icon><Star /></el-icon>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="dashboard-charts">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>角色分布</span>
          </div>
        </template>
        <div class="chart-container">
          <el-empty description="暂无图表数据" v-if="!roleChartData.length" />
          <div v-else>
            <!-- 这里可以放置图表，例如使用ECharts -->
            <div class="chart-placeholder">
              <el-icon class="chart-icon"><PieChart /></el-icon>
              <p>角色分布图表</p>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>通话统计</span>
          </div>
        </template>
        <div class="chart-container">
          <el-empty description="暂无图表数据" v-if="!callStats.length" />
          <div v-else>
            <!-- 这里可以放置图表，例如使用ECharts -->
            <div class="chart-placeholder">
              <el-icon class="chart-icon"><PieChart /></el-icon>
              <p>通话统计图表</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="recent-activities">
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <span>最近活动</span>
          </div>
        </template>
        <div class="activity-list">
          <el-empty description="暂无活动记录" v-if="!activities.length" />
          <div v-else>
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-icon">
                <el-icon><Bell /></el-icon>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoleStore, useVoiceStore, useRecommendStore } from '../store'
import { User, Mic, Star, PieChart, Bell } from '@element-plus/icons-vue'

const roleStore = useRoleStore()
const voiceStore = useVoiceStore()
const recommendStore = useRecommendStore()

// 统计数据
const roleCount = computed(() => roleStore.roles.length)
const voiceCount = computed(() => voiceStore.voices.length)
const recommendCount = computed(() => recommendStore.recommendedRoles.length)

// 图表数据（模拟）
const roleChartData = ref([
  { name: '男性', value: 65 },
  { name: '女性', value: 35 }
])

const callStats = ref([
  { name: '周一', value: 120 },
  { name: '周二', value: 150 },
  { name: '周三', value: 180 },
  { name: '周四', value: 140 },
  { name: '周五', value: 200 },
  { name: '周六', value: 90 },
  { name: '周日', value: 80 }
])

// 最近活动（模拟）
const activities = ref([
  {
    id: 1,
    text: '管理员创建了新角色：张三',
    time: '2023-08-01 10:00:00'
  },
  {
    id: 2,
    text: '管理员上传了新声音文件',
    time: '2023-08-01 14:30:00'
  },
  {
    id: 3,
    text: '管理员更新了推荐角色列表',
    time: '2023-08-02 09:15:00'
  }
])

onMounted(() => {
  // 在实际应用中，这里可以加载图表数据和活动记录
})
</script>

<style scoped>
.dashboard {
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

.dashboard-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.stat-info .stat-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-info .stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-icon {
  font-size: 40px;
  color: #1890ff;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  height: 300px;
}

.chart-container {
  height: calc(100% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.recent-activities {
  margin-bottom: 30px;
}

.activity-card {
  min-height: 300px;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  margin-right: 15px;
  color: #1890ff;
}

.activity-content .activity-text {
  color: #303133;
  margin-bottom: 5px;
}

.activity-content .activity-time {
  color: #909399;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-stats {
    flex-direction: column;
  }
  
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}
</style>