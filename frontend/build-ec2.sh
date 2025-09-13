#!/bin/bash

# t3.micro EC2 환경에서 안전한 빌드를 위한 스크립트
echo "🚀 Starting t3.micro optimized build process..."

# 1. 환경 변수 설정 (t3.micro: 1GB RAM)
export NODE_OPTIONS="--max-old-space-size=768"
echo "✅ Node memory limit set to 768MB (75% of 1GB)"

# 2. 기존 빌드 캐시 정리
echo "🧹 Cleaning previous build cache..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf .tsbuildinfo

# 3. 종속성 확인 및 설치
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --prefer-offline --no-audit
fi

# 4. TypeScript 타입 체크 (별도 프로세스)
echo "🔍 Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript type check failed!"
    exit 1
fi

# 5. Vite 빌드 실행 (TypeScript 체크 스킵하여 메모리 절약)
echo "🏗️ Building with Vite (fast mode)..."
npx vite build --mode production

# 6. 빌드 결과 확인
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size:"
    du -sh dist
    echo "📁 Build contents:"
    ls -la dist/
else
    echo "❌ Build failed - dist directory not created"
    exit 1
fi

echo "🎉 EC2 build process completed!"