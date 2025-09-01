<template>
  <div class="voice-management">
    <div class="page-header">
      <h1>声音管理</h1>
      <p>上传和管理系统中的声音文件</p>
    </div>
    
    <!-- 上传声音文件 -->
    <el-card class="upload-voice-card">
      <template #header>
        <div class="card-header">
          <span>上传声音</span>
        </div>
      </template>
      <div class="upload-content">
        <el-upload
          class="voice-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeVoiceUpload"
          :on-success="handleVoiceUpload"
          :auto-upload="false"
          ref="voiceUploadRef"
          accept=".mp3,.wav"
        >
          <el-button type="primary">点击上传声音文件</el-button>
        </el-upload>
        <el-button type="text" @click="triggerUpload">选择文件</el-button>
        <div v-if="selectedFile" class="file-info">
          <el-tag>{{ selectedFile.name }}</el-tag>
          <el-button type="text" size="small" @click="removeFile">移除</el-button>
        </div>
        <div class="voice-info-form" v-if="selectedFile">
          <el-form :model="voiceInfo" class="info-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="声音性别">
                  <el-select v-model="voiceInfo.gender" placeholder="请选择声音性别">
                    <el-option label="男" value="male" />
                    <el-option label="女" value="female" />
                    <el-option label="中性" value="neutral" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="声音描述">
                  <el-input v-model="voiceInfo.description" type="textarea" placeholder="请输入声音描述" :rows="2" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="upload-actions">
            <el-button type="primary" @click="startCloning">开始克隆</el-button>
          </div>
        </div>
        <!-- 克隆进度条 -->
        <div v-if="cloningProgress > 0 && cloningProgress < 100" class="cloning-progress">
          <el-progress :percentage="cloningProgress" status="success" />
          <p>正在克隆声音，请稍候...</p>
        </div>
      </div>
    </el-card>
    
    <!-- 声音列表 -->
    <el-card class="voice-list-card">
      <template #header>
        <div class="card-header">
          <span>声音列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索声音ID或描述"
            prefix-icon="Search"
            style="width: 200px; margin-left: 20px;"
          />
        </div>
      </template>
      <el-table :data="filteredVoices" style="width: 100%">
        <el-table-column prop="id" label="声音ID" width="150" />
        <el-table-column prop="gender" label="声音性别" width="100">
          <template #default="scope">
            <span>{{ getGenderLabel(scope.row.gender) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="声音描述" show-overflow-tooltip />
        <el-table-column prop="originalVoice" label="原始声音" width="180">
          <template #default="scope">
            <el-button type="text" @click="playOriginalVoice(scope.row)" size="small">
              <span>{{ scope.row.originalVoice }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="clonedVoice" label="克隆声音" width="180">
          <template #default="scope">
            <el-button type="text" @click="playClonedVoice(scope.row)" size="small">
              <span>{{ scope.row.clonedVoice }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDeleteVoice(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredVoices.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 音频播放器 -->
    <div v-if="playingVoice" class="audio-player">
      <el-card class="player-card">
        <div class="player-content">
          <div class="player-info">
            <h3>{{ playingVoice.isOriginal ? '原始声音' : '克隆声音' }}</h3>
            <p>{{ playingVoice.voice.description }}</p>
          </div>
          <div class="player-controls">
            <el-button type="text" @click="togglePlay" size="large">
                <span>{{ isPlaying ? '停止' : '播放' }}</span>
              </el-button>
            <el-slider v-model="currentTime" :max="duration" @change="seek" class="slider" />
            <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
          <el-button type="text" @click="stopPlay">关闭</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVoiceStore } from '../store'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const voiceStore = useVoiceStore()

// 上传相关
const voiceUploadRef = ref()
const selectedFile = ref(null)
const voiceInfo = ref({
  gender: '',
  description: ''
})
const cloningProgress = ref(0)

// 声音列表相关
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 音频播放相关
const playingVoice = ref(null)
const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// 过滤后的声音列表
const filteredVoices = computed(() => {
  if (!searchKeyword.value) {
    return voiceStore.voices
  }
  return voiceStore.voices.filter(voice => 
    voice.id.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    voice.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
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
function triggerUpload() {
  voiceUploadRef.value.$el.querySelector('input').click()
}

function beforeVoiceUpload(file) {
  const isAudio = ['audio/mpeg', 'audio/wav'].includes(file.type)
  if (!isAudio) {
    ElMessage.error('只能上传MP3或WAV文件！')
    return false
  }
  const isLt20M = file.size / 1024 / 1024 < 20
  if (!isLt20M) {
    ElMessage.error('上传声音文件大小不能超过 20MB！')
    return false
  }
  selectedFile.value = file
  return false // 阻止自动上传
}

function handleVoiceUpload() {
  // 由于阻止了自动上传，这里不会被调用
}

function removeFile() {
  selectedFile.value = null
  voiceInfo.value = {
    gender: '',
    description: ''
  }
}

// 模拟声音克隆
function startCloning() {
  if (!selectedFile.value) {
    ElMessage.error('请先选择要克隆的声音文件')
    return
  }
  
  if (!voiceInfo.value.gender) {
    ElMessage.error('请选择声音性别')
    return
  }
  
  cloningProgress.value = 0
  
  // 模拟克隆过程
  const interval = setInterval(() => {
    cloningProgress.value += 10
    if (cloningProgress.value >= 100) {
      clearInterval(interval)
      
      // 克隆完成后添加到声音列表
      voiceStore.addVoice({
        originalVoice: selectedFile.value.name,
        clonedVoice: `cloned_${selectedFile.value.name}`,
        gender: voiceInfo.value.gender,
        description: voiceInfo.value.description,
        originalVoiceUrl: URL.createObjectURL(selectedFile.value),
        clonedVoiceUrl: URL.createObjectURL(selectedFile.value) // 模拟克隆后的URL
      })
      
      ElMessage.success('声音克隆成功')
      removeFile()
      setTimeout(() => {
        cloningProgress.value = 0
      }, 1000)
    }
  }, 300)
}

// 声音操作方法
function handleDeleteVoice(id) {
  ElMessageBox.confirm('确定要删除这个声音吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    voiceStore.deleteVoice(id)
    ElMessage.success('声音删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 音频播放相关方法
function playOriginalVoice(voice) {
  playVoice(voice, true)
}

function playClonedVoice(voice) {
  playVoice(voice, false)
}

function playVoice(voice, isOriginal) {
  // 停止当前播放的音频
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  
  playingVoice.value = {
    voice: voice,
    isOriginal: isOriginal
  }
  
  // 创建新的音频实例
  const url = isOriginal ? voice.originalVoiceUrl : voice.clonedVoiceUrl
  audio.value = new Audio(url)
  
  // 设置音频事件监听
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration
  })
  
  audio.value.addEventListener('timeupdate', () => {
    currentTime.value = audio.value.currentTime
  })
  
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
    currentTime.value = 0
  })
  
  // 开始播放
  audio.value.play()
  isPlaying.value = true
}

function togglePlay() {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

function stopPlay() {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  playingVoice.value = null
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
}

function seek(value) {
  if (audio.value) {
    audio.value.currentTime = value
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 辅助方法
function getGenderLabel(gender) {
  const genders = {
    'male': '男',
    'female': '女',
    'neutral': '中性'
  }
  return genders[gender] || gender
}

onMounted(() => {
  // 初始化时的操作
})
</script>

<style scoped>
.voice-management {
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

.upload-voice-card,
.voice-list-card {
  margin-bottom: 30px;
}

.upload-content {
  padding: 20px 0;
}

.file-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.voice-info-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.info-form {
  margin-bottom: 20px;
}

.upload-actions {
  text-align: right;
}

.cloning-progress {
  margin-top: 20px;
}

.cloning-progress p {
  text-align: center;
  color: #606266;
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.audio-player {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 800px;
  z-index: 1000;
}

.player-card {
  background-color: rgba(255, 255, 255, 0.95);
}

.player-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.player-info h3 {
  margin: 0 0 5px 0;
  color: #303133;
}

.player-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.player-controls {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider {
  flex: 1;
  width: 200px;
}

.time-display {
  min-width: 80px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .audio-player {
    width: 95%;
  }
  
  .player-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .slider {
    width: 100%;
  }
}
</style>