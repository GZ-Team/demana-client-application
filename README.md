# demana-client-application

An Electron application built with Vue and TypeScript.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/current): >= v16.14
- [PnpM](https://pnpm.io/installation)

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

to enable hot-reload: use

```bash
$ pnpm dev:hot-reload
```

### Preview

```bash
$ pnpm preview
```

### Build

```bash
# For windows
$ pnpm build:windows

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

## Future considerations

- [Electronegativity](https://github.com/doyensec/electronegativity)
- Custom installer:
  - [web-installer](https://www.electron.build/configuration/nsis.html#web-installer)
  - [custom-nsis-script](https://www.electron.build/configuration/nsis.html#custom-nsis-script)
- [Custom application frame](https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows)
  - Branch: feature/custom-app-frame
- [Online/Offline Event Detection](https://www.electronjs.org/docs/latest/tutorial/online-offline-events)
