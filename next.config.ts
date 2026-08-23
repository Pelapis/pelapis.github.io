import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 静态导出,产物输出到 docs/(GitHub Pages 约定)
  output: "export",
  distDir: "docs",
  // 多锁文件场景下显式指定 workspace root
  outputFileTracingRoot: path.join(import.meta.dirname, "./"),
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
