import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',   // 保证打包后资源路径正确，适配任意部署目录
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})