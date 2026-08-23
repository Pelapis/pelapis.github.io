# 个人博客 (Next.js)

基于 React + TypeScript + Next.js (App Router) + Tailwind CSS 4 + Jotai 的个人博客与项目展示站点。

## 功能

- **首页** (`/`):项目作品展示卡片
- **关于** (`/about`):博主与技术栈介绍
- **猫抓鱼小游戏** (`/catgame`):触屏小游戏,难度/模式/主题可切换(设置持久化)
- **贪吃蛇游戏** (`/snake`):Canvas 实现,键盘/触屏操控
- **投资模拟** (`/invest`):Rust WASM + kkrpc Web Worker + Vega-Lite,展示不同持有期的收益分布

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router, 静态导出) |
| UI | React 19, Tailwind CSS 4 |
| 状态管理 | Jotai (atomWithStorage 持久化) |
| Worker RPC | kkrpc |
| 可视化 | Vega-Lite, vega-embed |
| 计算 | Rust → WebAssembly |
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
├── app/
│   ├── layout.tsx          # 根布局(metadata / 全局样式)
│   ├── (site)/             # 路由组:首页 + 关于(共享 NavBar/Footer)
│   ├── catgame/            # 猫抓鱼:atoms.ts + 组件同级存放
│   ├── snake/              # 贪吃蛇:atoms.ts + SnakeGame
│   └── invest/             # 投资模拟:atoms / kkrpc worker / VegaChart / wasm
├── components/             # 跨路由共享组件(NavBar / Footer)
└── lib/                    # 纯数据与工具(projects.ts)
public/
└── invest/                 # CSV 数据与 WASM 二进制(运行时 fetch)
```
