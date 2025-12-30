import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory and parent directories
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Use VITE_APP_BASE env variable for base path, default to "/"
    base: env.VITE_APP_BASE || '/',
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
