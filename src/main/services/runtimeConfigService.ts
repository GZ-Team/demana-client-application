import { getEnvironmentMode, isLocal, isDev } from '../utils/environmentUtils';

type ImportMetaEnvKey = keyof ImportMetaEnv;

export default class RuntimeConfigService {
  private static PUBLIC_ENV_PREFIX = 'V_DEMANA_PUBLIC_';

  get runtimeConfig(): ImportMetaEnv {
    return import.meta.env;
  }

  get publicRuntimeConfig(): Record<string, unknown> {
    return Object.entries<ImportMetaEnv>(this.runtimeConfig)
      .filter(([key]) => key.includes(RuntimeConfigService.PUBLIC_ENV_PREFIX))
      .reduce(
        (config, [key, value]) => ({
          ...config,
          [this.mapPublicRuntimeConfigKey(key)]: value
        }),
        {}
      );
  }

  get mode(): string {
    return getEnvironmentMode();
  }

  get isLocal(): boolean {
    return isLocal();
  }

  get isDev(): boolean {
    return isDev();
  }

  private mapPublicRuntimeConfigKey(key: ImportMetaEnvKey): string | ImportMetaEnvKey {
    switch (key) {
      case 'V_DEMANA_PUBLIC_BACK_OFFICE_URL':
        return 'backofficeUrl';

      default:
        return key;
    }
  }
}
