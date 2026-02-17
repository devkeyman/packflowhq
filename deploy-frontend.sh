#!/bin/bash

# MES Frontend 배포 스크립트
# 사용법: ./deploy-frontend.sh

set -e

# 설정
PEM_FILE="/Users/gimmunjong/Documents/programming/mes-inno/innopackage-smart-factory-mes.pem"
SERVER="ubuntu@13.209.192.235"
FRONTEND_DIR="/Users/gimmunjong/Documents/programming/mes-inno/frontend"
REMOTE_DIR="/var/www/mes/frontend"

echo "🚀 MES Frontend 배포 시작"
echo "================================"

# 1. 빌드
echo "📦 1/3. Frontend 빌드 중..."
cd "$FRONTEND_DIR"
npm run build --silent
echo "✅ 빌드 완료"

# 2. 서버로 전송
echo "📤 2/3. 서버로 파일 전송 중..."
rsync -avz --delete --rsync-path="sudo rsync" -e "ssh -i $PEM_FILE -o StrictHostKeyChecking=no" dist/ "$SERVER:$REMOTE_DIR/"
echo "✅ 파일 전송 완료"

# 3. 권한 설정 및 nginx reload
echo "🔄 3/3. 서버 설정 중..."
ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$SERVER" << 'EOF'
    sudo chown -R www-data:www-data /var/www/mes/frontend
    sudo find /var/www/mes/frontend -type d -exec chmod 755 {} \;
    sudo find /var/www/mes/frontend -type f -exec chmod 644 {} \;
    sudo nginx -t && sudo systemctl reload nginx
EOF
echo "✅ 서버 설정 완료"

echo "================================"
echo "🎉 Frontend 배포 완료!"
echo "🔗 https://www.innopackage.com"
