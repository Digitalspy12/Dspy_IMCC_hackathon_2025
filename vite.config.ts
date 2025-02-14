import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // Change to default Vite port
    proxy: {
      '/static': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/detect': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
