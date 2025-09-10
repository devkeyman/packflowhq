#!/bin/bash

echo "========================================="
echo "Smart Factory MES 빌드 스크립트"
echo "========================================="

# 스크립트 실행 위치 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "프로젝트 루트: $PROJECT_ROOT"

# Frontend 빌드
echo ""
echo "[1/4] Frontend 빌드 시작..."
echo "-----------------------------------------"
cd "$PROJECT_ROOT/frontend"

if [ ! -d "node_modules" ]; then
    echo "의존성 설치 중..."
    npm install
fi

echo "Frontend 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend 빌드 실패"
    exit 1
fi
echo "✅ Frontend 빌드 완료"

# Backend static 리소스 정리
echo ""
echo "[2/4] Backend static 리소스 정리..."
echo "-----------------------------------------"
cd "$PROJECT_ROOT/backend"
rm -rf src/main/resources/static/*
mkdir -p src/main/resources/static

# Frontend 빌드 파일 복사
echo ""
echo "[3/4] Frontend 빌드 파일 복사..."
echo "-----------------------------------------"
cp -r "$PROJECT_ROOT/frontend/dist/"* src/main/resources/static/
echo "✅ 정적 리소스 복사 완료"

# Backend JAR 빌드
echo ""
echo "[4/4] Backend JAR 빌드..."
echo "-----------------------------------------"
./gradlew clean build -x test

if [ $? -ne 0 ]; then
    echo "❌ Backend 빌드 실패"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ 빌드 완료!"
echo "========================================="
echo ""
echo "JAR 파일 위치:"
ls -lh build/libs/*.jar
echo ""
echo "실행 명령어:"
echo "java -jar build/libs/$(ls build/libs/*.jar | xargs -n 1 basename)"