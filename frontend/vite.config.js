import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * cấu hình dự án frontend vite với react plugin
 * chạy trên cổng port 5173 và hỗ trợ hmr (hot module replacement)
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    host: true,
  },
});

