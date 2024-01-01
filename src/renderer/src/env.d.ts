/// <reference types="vite/client" />

import { DemanaClientApi } from '@/preload'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>

  export default { component, DemanaError }
}

declare global {
  interface Window {
    electron: any
    api: DemanaClientApi
  }
}