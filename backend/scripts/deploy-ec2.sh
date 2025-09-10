#!/bin/bash

# 배포 환경 설정
DEPLOYMENT_ENV="${1:-prod}"
SERVICE_NAME="mes"
APP_DIR="/home/ec2-user/smart-factory-mes"
JAR_NAME="smart-factory-mes.jar"

echo "========================================="
echo "Smart Factory MES EC2 배포"
echo "Environment: $DEPLOYMENT_ENV"
echo "========================================="

# Git 최신 변경사항 확인
echo ""
echo "[1/7] Git 최신 변경사항 확인..."
echo "-----------------------------------------"
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "이미 최신 버전입니다."
    read -p "그래도 배포를 진행하시겠습니까? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "배포를 취소합니다."
        exit 0
    fi
else
    echo "새로운 변경사항이 있습니다."
    git pull origin main
fi

# Frontend 빌드
echo ""
echo "[2/7] Frontend 빌드..."
echo "-----------------------------------------"
cd frontend
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend 빌드 실패"
    exit 1
fi

# Backend static 리소스 업데이트
echo ""
echo "[3/7] Static 리소스 업데이트..."
echo "-----------------------------------------"
cd ../backend
rm -rf src/main/resources/static/*
cp -r ../frontend/dist/* src/main/resources/static/

# Backend 빌드
echo ""
echo "[4/7] Backend JAR 빌드..."
echo "-----------------------------------------"
./gradlew clean build -x test

if [ $? -ne 0 ]; then
    echo "❌ Backend 빌드 실패"
    exit 1
fi

# 기존 서비스 중지
echo ""
echo "[5/7] 기존 서비스 중지..."
echo "-----------------------------------------"
if systemctl is-active --quiet $SERVICE_NAME; then
    sudo systemctl stop $SERVICE_NAME
    echo "서비스가 중지되었습니다."
    sleep 3
else
    echo "실행 중인 서비스가 없습니다."
fi

# 백업 생성
echo ""
echo "[6/7] 이전 버전 백업..."
echo "-----------------------------------------"
if [ -f "$APP_DIR/$JAR_NAME" ]; then
    BACKUP_NAME="${JAR_NAME}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$APP_DIR/$JAR_NAME" "$APP_DIR/$BACKUP_NAME"
    echo "백업 생성: $BACKUP_NAME"
    
    # 오래된 백업 파일 정리 (7일 이상)
    find "$APP_DIR" -name "*.backup.*" -mtime +7 -delete
fi

# 새 버전 배포
echo ""
echo "[7/7] 새 버전 배포..."
echo "-----------------------------------------"
cp build/libs/*.jar "$APP_DIR/$JAR_NAME"

# 서비스 시작
sudo systemctl start $SERVICE_NAME

# 헬스 체크
echo ""
echo "서비스 상태 확인..."
sleep 5

MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health | grep -q "200"; then
        echo ""
        echo "========================================="
        echo "✅ 배포 성공!"
        echo "========================================="
        echo ""
        echo "배포 정보:"
        echo "- 환경: $DEPLOYMENT_ENV"
        echo "- 버전: $(git rev-parse --short HEAD)"
        echo "- 시간: $(date)"
        echo ""
        sudo systemctl status $SERVICE_NAME --no-pager | head -n 10
        exit 0
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 2
done

echo ""
echo "❌ 헬스 체크 실패"
echo "로그를 확인해주세요:"
echo "sudo journalctl -u $SERVICE_NAME -n 50"
exit 1