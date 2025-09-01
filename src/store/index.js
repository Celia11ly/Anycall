import { defineStore } from 'pinia'

// 定义主store
export const useMainStore = defineStore('main', {
  state: () => ({
    // 全局状态可以在这里定义
    loading: false
  }),
  actions: {
    setLoading(loading) {
      this.loading = loading
    }
  }
})

// 角色管理相关store
export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [
      // 模拟数据
      {
        id: 1,
        name: '张三',
        description: '一个友好的客服角色',
        gender: 'male',
        language: 'zh-CN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
        voiceId: 'voice1',
        createdAt: '2023-08-01 10:00:00'
      },
      {
        id: 2,
        name: '李四',
        description: '专业的技术支持角色',
        gender: 'female',
        language: 'zh-CN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
        voiceId: 'voice2',
        createdAt: '2023-08-02 14:30:00'
      }
    ]
  }),
  actions: {
    addRole(role) {
      this.roles.push({
        ...role,
        id: Date.now(),
        createdAt: new Date().toLocaleString('zh-CN')
      })
    },
    updateRole(id, updatedRole) {
      const index = this.roles.findIndex(role => role.id === id)
      if (index !== -1) {
        this.roles[index] = { ...this.roles[index], ...updatedRole }
      }
    },
    deleteRole(id) {
      this.roles = this.roles.filter(role => role.id !== id)
    }
  }
})

// 声音管理相关store
export const useVoiceStore = defineStore('voice', {
  state: () => ({
    voices: [
      // 模拟数据
      {
        id: 'voice1',
        originalVoice: '原始声音1.mp3',
        clonedVoice: '克隆声音1.mp3',
        gender: 'male',
        description: '低沉有力的男性声音',
        originalVoiceUrl: 'https://example.com/original1.mp3',
        clonedVoiceUrl: 'https://example.com/cloned1.mp3'
      },
      {
        id: 'voice2',
        originalVoice: '原始声音2.mp3',
        clonedVoice: '克隆声音2.mp3',
        gender: 'female',
        description: '清脆甜美的女性声音',
        originalVoiceUrl: 'https://example.com/original2.mp3',
        clonedVoiceUrl: 'https://example.com/cloned2.mp3'
      }
    ]
  }),
  actions: {
    addVoice(voice) {
      this.voices.push({
        ...voice,
        id: `voice${Date.now()}`
      })
    },
    deleteVoice(id) {
      this.voices = this.voices.filter(voice => voice.id !== id)
    }
  }
})

// 推荐管理相关store
export const useRecommendStore = defineStore('recommend', {
  state: () => ({
    recommendedRoles: [
      // 模拟数据
      {
        id: 1,
        roleId: 1,
        name: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
        callCount: 1000,
        order: 1
      },
      {
        id: 2,
        roleId: 2,
        name: '李四',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
        callCount: 800,
        order: 2
      }
    ]
  }),
  actions: {
    addRecommend(recommend) {
      this.recommendedRoles.push({
        ...recommend,
        id: Date.now()
      })
      // 按order排序
      this.recommendedRoles.sort((a, b) => a.order - b.order)
    },
    updateRecommend(id, updatedRecommend) {
      const index = this.recommendedRoles.findIndex(item => item.id === id)
      if (index !== -1) {
        this.recommendedRoles[index] = { ...this.recommendedRoles[index], ...updatedRecommend }
      }
      // 按order排序
      this.recommendedRoles.sort((a, b) => a.order - b.order)
    },
    deleteRecommend(id) {
      this.recommendedRoles = this.recommendedRoles.filter(item => item.id !== id)
      // 重新排序
      this.recommendedRoles.forEach((item, index) => {
        item.order = index + 1
      })
    }
  }
})