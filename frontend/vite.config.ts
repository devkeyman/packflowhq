import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/widgets": path.resolve(__dirname, "./src/widgets"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/entities": path.resolve(__dirname, "./src/entities"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  build: {
    // EC2 환경을 위한 최적화 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 청크 크기 제한 증가
    chunkSizeWarningLimit: 1000,
    // 메모리 효율적인 빌드를 위한 설정
    sourcemap: false,
    // 빌드 출력 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-slot'],
          'query-vendor': ['@tanstack/react-query'],
          'utils': ['axios', 'clsx', 'tailwind-merge', 'zustand'],
        },
      },
      // 메모리 사용량 최적화
      maxParallelFileOps: 2,
    },
  },
  // 서버 설정 (개발 환경)
  server: {
    host: true,
    port: 5173,
  },
});
