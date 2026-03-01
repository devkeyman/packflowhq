#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/deploy.env"

echo "🚀 ${PROJECT_NAME} Frontend 배포 시작"
echo "================================"

echo "📦 1/3. Frontend 빌드 중..."
cd "$SCRIPT_DIR/$FRONTEND_DIR"
npm ci --silent || true
npm run build --silent
echo "✅ 빌드 완료"

echo "📤 2/3. 서버로 파일 전송 중..."
# dist(or build) → 서버 REMOTE_FRONTEND_DIR
rsync -avz --delete \
  --rsync-path="sudo rsync" \
  -e "ssh -i $SCRIPT_DIR/$PEM_FILE -o StrictHostKeyChecking=no" \
  "$SCRIPT_DIR/$FRONTEND_DIR/$FRONTEND_BUILD_DIR/" \
  "$SERVER:$REMOTE_FRONTEND_DIR/"
echo "✅ 파일 전송 완료"

echo "🔄 3/3. 권한 설정 및 nginx reload..."
ssh -i "$SCRIPT_DIR/$PEM_FILE" -o StrictHostKeyChecking=no "$SERVER" << EOF
  sudo chown -R www-data:www-data "$REMOTE_FRONTEND_DIR"
  sudo find "$REMOTE_FRONTEND_DIR" -type d -exec chmod 755 {} \;
  sudo find "$REMOTE_FRONTEND_DIR" -type f -exec chmod 644 {} \;
  sudo nginx -t && sudo systemctl reload nginx
EOF
echo "✅ 서버 설정 완료"

echo "================================"
echo "🎉 Frontend 배포 완료!"
echo "🔗 https://www.${DOMAIN}"