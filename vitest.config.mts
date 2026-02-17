import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',

    server: {
      deps: {
        inline: ['next-intl']
      }
    },
    // projects: [{
    //   extends: true,
    //   plugins: [
    //     // The plugin will run tests for the stories defined in your Storybook config
    //     // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    //     storybookTest({
    //       configDir: path.join(dirname, '.storybook')
    //     })],
    //   test: {
    //     name: 'storybook',
    //     browser: {
    //       enabled: true,
    //       headless: true,
    //       provider: playwright({}),
    //       instances: [{
    //         browser: 'chromium'
    //       }]
    //     },
    //     setupFiles: ['.storybook/vitest.setup.ts']
    //   }
    // }]
  }
});