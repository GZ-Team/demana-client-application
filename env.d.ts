/// <reference types="vite/client" />

/**
 * Type for all imported environment variables.
 * https://electron-vite.org/guide/env-and-mode#global-env-variables
 *
 * Prefixes:
 * - MAIN_VITE_: main process
 * - PRELOAD_VITE_: preload process
 * - RENDERER_VITE_: renderer process
 */
interface ImportMetaEnv {
  // API
  VITE_BACK_OFFICE_API_URL: string;

  // COOKIES
  MAIN_VITE_COOKIE_DOMAIN: string;
  VITE_ACCESS_TOKEN_NAME: string;
  VITE_REFRESH_TOKEN_NAME: string;

  // PUBLIC
  RENDERER_VITE_BACK_OFFICE_URL: string;
  RENDERER_VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
