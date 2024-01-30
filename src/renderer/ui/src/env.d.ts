/// <reference types="vite/client" />

import type { DemanaUiProcessPreloadApi } from '../../../preload/uiPreload';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;

  export default { component, DemanaError };
}

declare global {
  interface Window {
    electron: any;
    api: DemanaUiProcessPreloadApi;
  }
}

declare module '*.svg' {
  const filePath: string;

  export default filePath;
}
