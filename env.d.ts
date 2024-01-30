/// <reference types="vite/client" />

/**
 * Type for all imported environment variables.
 * Prefixes:
 * - V_DEMANA_: all processes
 * - MAIN_V_DEMANA_: main process
 * - PRELOAD_V_DEMANA_: preload process
 * - RENDERER_V_DEMANA: renderer process
 */
interface ImportMetaEnv {
  // API
  V_DEMANA_BACK_OFFICE_API_URL: string;

  // COOKIES
  V_DEMANA_COOKIE_DOMAIN: string;
  V_DEMANA_ACCESS_TOKEN_NAME: string;
  V_DEMANA_REFRESH_TOKEN_NAME: string;

  // PUBLIC
  V_DEMANA_PUBLIC_BACK_OFFICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
