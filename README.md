# 个人博客 (Next.js)

基于 React + TypeScript + Next.js (App Router) + Tailwind CSS 4 + Zustand + Jotai 的个人博客与项目展示站点。

## 功能

- **首页**:项目作品展示卡片
- **猫抓鱼小游戏** (`/catgame`):经典触屏小游戏,多主题切换
- **贪吃蛇游戏** (`/snake`):Canvas 实现,键盘/按钮操控
- **投资模拟** (`/invest`):Rust WASM + Comlink Web Worker + Vega-Lite 可视化,展示不同持有期的收益分布

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router, 静态导出) |
| UI | React 19, Tailwind CSS 4 |
| 状态 | Zustand, Jotai |
| 可视化 | Vega-Lite, vega-embed |
| 计算 | Rust → WebAssembly (Comlink + Web Worker) |
| 语言 | TypeScript |

## 开发

```bash
bun install
bun run dev      # 开发服务器 http://localhost:3000
bun run build    # 静态导出到 docs/
bun run lint     # ESLint 检查
```

## 部署

推送到 `nextjs` 分支后,GitHub Actions 自动构建并把 `docs/` 静态产物发布到 GitHub Pages。

## 目录结构

```
src/
├── app/                 # App Router 路由
│   ├── layout.tsx       # 根布局(元数据、全局样式)
│   ├── page.tsx         # 首页
│   ├── about/           # 关于页
│   ├── catgame/         # 猫抓鱼(客户端组件)
│   ├── snake/           # 贪吃蛇(客户端组件)
│   └── invest/          # 投资模拟(server page + client 组件)
├── components/layout/   # 主站布局(NavBar / Footer)
├── features/            # 功能模块
│   ├── catgame/         # 猫抓鱼游戏
│   ├── snake/           # 贪吃蛇游戏
│   └── invest/          # 投资模拟(WASM + Worker + Vega)
└── store/               # Zustand 全局状态
public/
└── invest/              # CSV 数据与 WASM 二进制(运行时 fetch)
```
