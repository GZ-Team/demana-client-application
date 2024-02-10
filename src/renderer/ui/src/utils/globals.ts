export function isDev(): boolean {
  return window.electron.process.env.NODE_ENV_ELECTRON_VITE === 'development';
}
