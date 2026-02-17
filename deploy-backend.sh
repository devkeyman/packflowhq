#!/bin/bash

# MES Backend 배포 스크립트
# 사용법: ./deploy-backend.sh

set -e

# 설정
PEM_FILE="/Users/gimmunjong/Documents/programming/mes-inno/innopackage-smart-factory-mes.pem"
SERVER="ubuntu@13.209.192.235"
JAR_NAME="mes-inno-0.0.1-SNAPSHOT.jar"
BACKEND_DIR="/Users/gimmunjong/Documents/programming/mes-inno/backend"
REMOTE_DIR="/opt/mes"

echo "🚀 MES Backend 배포 시작"
echo "================================"

# 1. 빌드
echo "📦 1/4. JAR 파일 빌드 중..."
cd "$BACKEND_DIR"
./mvnw clean package -DskipTests -q
echo "✅ 빌드 완료"

# 2. 서버로 복사
echo "📤 2/4. 서버로 파일 전송 중..."
scp -i "$PEM_FILE" -o StrictHostKeyChecking=no "target/$JAR_NAME" "$SERVER:/tmp/"
echo "✅ 파일 전송 완료"

# 3. 서버에서 배포 실행
echo "🔄 3/4. 서버에서 배포 중..."
ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$SERVER" << 'EOF'
    # 서비스 중지
    sudo systemctl stop mes 2>/dev/null || true
    
    # 백업
    if [ -f /opt/mes/mes-inno-0.0.1-SNAPSHOT.jar ]; then
        cp /opt/mes/mes-inno-0.0.1-SNAPSHOT.jar /opt/mes/mes-inno-0.0.1-SNAPSHOT.jar.backup
    fi
    
    # 새 파일 이동
    mv /tmp/mes-inno-0.0.1-SNAPSHOT.jar /opt/mes/
    
    # 권한 설정
    sudo chown ubuntu:ubuntu /opt/mes/mes-inno-0.0.1-SNAPSHOT.jar
    chmod 755 /opt/mes/mes-inno-0.0.1-SNAPSHOT.jar
    
    # 서비스 시작
    sudo systemctl start mes
    
    # 잠시 대기 후 상태 확인
    sleep 3
    sudo systemctl is-active mes
EOF
echo "✅ 배포 완료"

# 4. 헬스체크
echo "🏥 4/4. 헬스체크 중..."
sleep 5
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://13.209.192.235:8080/api/actuator/health 2>/dev/null || echo "000")
if [ "$HEALTH" = "200" ]; then
    echo "✅ 서버 정상 동작 확인"
else
    echo "⚠️  헬스체크 응답: $HEALTH (서버 시작 중일 수 있음)"
fi

echo "================================"
echo "🎉 배포 완료!"
echo "🔗 http://www.innopackage.com"
