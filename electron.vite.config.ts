import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
