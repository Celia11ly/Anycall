# AnyCall管理后台

一个基于Vue 3 + Element Plus构建的管理后台，包含用户注册/登录、角色创作和管理、声音管理、推荐管理等功能。

## 项目功能

- **用户注册/登录**：支持管理员账户的创建和登录
- **角色创作和管理**：
  - 输入角色姓名、人设描述、性别、使用语种、头像、声音文件
  - 自动创建角色并展示在角色列表
  - 支持修改、删除角色
  - 支持表格导入模式批量创建角色
- **声音管理**：
  - 上传声音自动完成克隆
  - 列表展示原始声音、克隆声音、声音ID、声音性别、声音描述
  - 支持声音试听功能
- **推荐管理**：
  - 通过输入角色ID和通话次数设置推荐角色
  - 推荐列表展示角色姓名、头像、通话次数、排序序号
  - 支持修改排序和通话次数

## 技术栈

- Vue 3
- Element Plus
- Vue Router
- Pinia (状态管理)
- Vite (构建工具)

## 项目结构

```
src/
├── views/              # 页面组件
│   ├── LoginView.vue         # 登录页面
│   ├── RegisterView.vue      # 注册页面
│   ├── DashboardView.vue     # 仪表盘页面
│   ├── RoleManagementView.vue # 角色管理页面
│   ├── VoiceManagementView.vue # 声音管理页面
│   └── RecommendManagementView.vue # 推荐管理页面
├── store/              # 状态管理
│   └── index.js         # Pinia store定义
├── App.vue             # 根组件
├── main.js             # 入口文件
└── router.js           # 路由配置
```

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 登录账户

- 用户名: admin
- 密码: admin123

## 注意事项

1. 由于是前端模拟环境，所有数据都存储在浏览器的localStorage中，刷新页面后数据会丢失
2. 声音克隆功能为前端模拟，实际项目中需要集成真实的声音克隆API
3. 表格导入功能为前端模拟，实际项目中需要实现真实的文件解析逻辑

## License

MIT