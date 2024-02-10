import { test, expect } from '@playwright/test';

import ElectronContext from './helpers/electronContext';

test.describe('Essentials', () => {
  let context: ElectronContext;

  test.beforeAll(async () => {
    context = new ElectronContext({ executablePath: 'out/main/index.js' });
    await context.setup();
  });

  test('has a path', async () => {
    const appPath = await context.application.evaluate(async ({ app }) => app.getAppPath());

    expect(appPath).not.toBeNull();
  });

  test('has windows', async () => {
    expect(context.windows.length).toBe(2);
  });
});
