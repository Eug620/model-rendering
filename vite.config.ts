/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-10-12 15:21:02
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-13 01:37:13
 * @FilePath     : /model-rendering/vite.config.ts
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: `${process.env.NODE_ENV === 'production' ? 'https://eug620.github.io/model-rendering/' : '/'}`,
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: "assets",
    //设置为 false 来禁用将构建后的文件写入磁盘
    write: true,
    //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
    emptyOutDir: true,
    //启用/禁用 brotli 压缩大小报告
    // brotliSize: true,
    //chunk 大小警告的限制
    chunkSizeWarningLimit: 1000,
    // 移除console
    minify: "terser",
    terserOptions: {

    },
    rollupOptions: {
      output: {
        // 拆分js
        manualChunks: {
          three: ["three"],
          lodash: ["lodash"],
        },
      },
    },
  },
  //调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
  logLevel: "info",
  //设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  clearScreen: true,
})
