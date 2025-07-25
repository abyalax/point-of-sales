import viteTsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routeFileIgnorePattern: '^(?!__root\\.tsx$)_+[^/]*|/_+[^/]+',
      routesDirectory: './src/app',
      pathParamsAllowedCharacters: ['@'],
    }),
    react(),
  ],
});
