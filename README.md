# Browser Simulator

一个基于 React + TypeScript 的浏览器模拟器，支持多标签页浏览、导航历史和主题切换等功能。

## 功能特点

- 多标签页管理
- 导航历史记录（前进/后退）
- 新标签页快速访问
- 支持浅色/深色主题切换
- 内置错误处理和安全提示

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 快速开始

1. 安装依赖
npm install

2. 启动开发服务器
npm run dev

3. 构建项目
npm run build

4. 预览构建结果
npm run preview

## 开发环境要求

- Node.js >= 18
- npm >= 8

## 项目目录结构

- src/components/：UI 组件目录
- src/contexts/：上下文管理目录
- src/types.ts：类型定义文件

## iframe 访问配置

由于浏览器安全限制，某些网站可能无法在 iframe 中打开。要允许网站在 iframe 中加载，目标网站需要：

1. 设置正确的 X-Frame-Options 响应头：
   - X-Frame-Options: ALLOWALL
   - 或不设置此响应头

2. 不包含 Content-Security-Policy 中的 frame-ancestors 限制

3. 对于自己的网站，可以在服务器配置中添加：
# Nginx 配置示例
add_header X-Frame-Options "ALLOWALL";

## 注意事项

1. 某些网站可能出于安全考虑禁用了 iframe 嵌入
2. 含有严格 CSP 策略的网站可能无法在模拟器中正常显示
3. HTTPS 网站中无法嵌入 HTTP 内容

## 开发建议

1. 开发时建议使用支持 iframe 嵌入的测试网站
2. 可以使用本地服务器测试，确保正确配置 CORS 和 frame 相关响应头
3. 针对不支持 iframe 的网站，已内置友好的错误提示界面

## TODO 清单

以下功能正在开发中：

1. 用户系统
   - 用户数据持久化
   - 云端同步功能
   - 多设备数据同步

2. Quick Access 增强
   - 快速访问项目分类
   - 快速访问排序
   - 导入/导出功能

3. 浏览器功能
   - 历史记录管理
   - 书签管理
   - 页面标题、logo读取
   - 打开新页面拦截
   - 前进、后退按钮增强
   - 下载管理

4. 界面优化
   - 自定义主题
   - 暗黑模式优化
   - 响应式布局适配