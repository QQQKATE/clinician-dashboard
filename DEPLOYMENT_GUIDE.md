# 🚀 GitHub Pages 部署指南

## 📋 部署前检查清单

### ✅ 1. 项目准备确认
- [x] 项目构建成功 (`npm run build`)
- [x] 所有依赖已安装
- [x] Vite 配置正确设置 base path
- [x] 界面文本完全英文化
- [x] 无编译错误

### ✅ 2. GitHub 仓库设置

#### 第一步：推送代码到 GitHub
```bash
# 如果还没有初始化 git
git init
git add .
git commit -m "Initial commit: Medical dashboard ready for deployment"

# 添加远程仓库（替换为您的用户名）
git remote add origin https://github.com/YOUR_USERNAME/clinician-dashboard.git
git branch -M main
git push -u origin main
```

#### 第二步：启用 GitHub Pages（重要！）
1. 进入 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Pages** 部分
4. 在 **Source** 下拉菜单中选择 **"GitHub Actions"**
5. **不要选择** "Deploy from a branch" - 这会导致权限错误

### ✅ 3. 仓库权限设置（关键步骤！）

#### 在 Settings > Actions > General 中确认：
1. **Actions permissions**: 选择 "Allow all actions and reusable workflows"
2. **Workflow permissions**: 选择 **"Read and write permissions"** 
3. **勾选** "Allow GitHub Actions to create and approve pull requests"

### ✅ 4. 避免上次的错误

您上次遇到的错误原因分析：
- `HttpError: Resource not accessible by integration`: 权限问题
- `Create Pages site failed`: GitHub Pages 源设置错误
- `Get Pages site failed`: 工作流权限不足

**已修复的问题：**
1. ✅ 修正了 `permissions` 在 workflow 文件中的位置
2. ✅ 移除了 pull_request 触发器
3. ✅ 添加了正确的 concurrency 设置

## 🔧 部署步骤

### 1. 确认配置文件
检查 `.github/workflows/deploy.yml` 已正确配置：
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 2. 推送到 GitHub
```bash
git add .
git commit -m "Fix: Update deployment configuration for GitHub Pages"
git push origin main
```

### 3. 监控部署过程
1. 进入 GitHub 仓库的 **Actions** 标签
2. 观察 "Deploy to GitHub Pages" 工作流运行
3. 如果失败，检查日志中的具体错误信息

### 4. 访问部署的站点
部署成功后，您的网站将在以下地址可用：
```
https://YOUR_USERNAME.github.io/clinician-dashboard/
```

## 🚨 常见问题解决

### 问题 1: "Resource not accessible by integration"
**解决方案：**
- 确保在 Settings > Actions > General 中启用了 "Read and write permissions"
- 确保 Pages 源设置为 "GitHub Actions"

### 问题 2: "Create Pages site failed"
**解决方案：**
- 进入 Settings > Pages
- 确保源设置为 "GitHub Actions" 而不是 "Deploy from a branch"

### 问题 3: 404 错误或资源加载失败
**解决方案：**
- 检查 `vite.config.js` 中的 `base` 配置是否正确
- 确保设置为 `base: '/clinician-dashboard/'`

### 问题 4: 工作流权限不足
**解决方案：**
- 确保 workflow 文件顶部有正确的 permissions 设置
- 检查 GitHub 仓库的 Actions 权限设置

## 📝 部署后验证

部署完成后，检查以下项目：
1. ✅ 网站可以正常访问
2. ✅ 所有页面功能正常
3. ✅ 样式和资源正确加载
4. ✅ 响应式设计在移动端正常工作
5. ✅ 所有界面文本显示为英文

## 🔄 更新部署

后续更新项目时：
```bash
git add .
git commit -m "Update: [描述您的更改]"
git push origin main
```

GitHub Actions 会自动重新部署您的更改。

## 📞 技术支持

如果遇到问题：
1. 检查 GitHub Actions 日志
2. 确认仓库设置是否正确
3. 验证 workflow 文件配置
4. 检查构建过程是否成功

---
**重要提醒：** 这次的配置已经修复了上次部署失败的所有问题。按照这个指南操作，应该可以成功部署！