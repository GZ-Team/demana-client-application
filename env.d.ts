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
    VITE_BACK_OFFICE_API_WS_URL: string;

    // RABBITMQ
    VITE_RABBITMQ_HOST: string
    VITE_RABBITMQ_PORT: string
    VITE_RABBITMQ_USERNAME: string
    VITE_RABBITMQ_PASSWORD: string

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
