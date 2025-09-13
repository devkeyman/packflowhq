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
    // t3.micro (1GB RAM) 최적화 설정
    minify: 'esbuild', // terser 대신 esbuild 사용 (더 빠르고 메모리 효율적)
    // 청크 크기 제한 증가
    chunkSizeWarningLimit: 1000,
    // 메모리 효율적인 빌드를 위한 설정
    sourcemap: false,
    // 빌드 출력 최적화
    rollupOptions: {
      output: {
        // 더 작은 청크로 분할
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack') || id.includes('axios')) {
              return 'data-vendor';
            }
            if (id.includes('zustand') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'utils';
            }
            return 'vendor';
          }
        },
        // 청크 파일명 최적화
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // t3.micro에 맞춘 병렬 처리
      maxParallelFileOps: 3,
    },
    // 빌드 성능 향상
    reportCompressedSize: false,
    cssCodeSplit: true,
  },
  // 서버 설정 (개발 환경)
  server: {
    host: true,
    port: 5173,
  },
});
