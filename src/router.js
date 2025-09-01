import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/DashboardView.vue'
import RoleManagementView from './views/RoleManagementView.vue'
import VoiceManagementView from './views/VoiceManagementView.vue'
import RecommendManagementView from './views/RecommendManagementView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/role',
    name: 'role',
    component: RoleManagementView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/voice',
    name: 'voice',
    component: VoiceManagementView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: RecommendManagementView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router