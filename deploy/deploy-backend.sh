#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/deploy.env"

echo "🚀 ${PROJECT_NAME} Backend 배포 시작"
echo "================================"

echo "📦 1/4. JAR 빌드 중..."
cd "$SCRIPT_DIR/$BACKEND_DIR"
./mvnw clean package -DskipTests -q
echo "✅ 빌드 완료"

echo "📤 2/4. 서버로 파일 전송 중..."
scp -i "$SCRIPT_DIR/$PEM_FILE" -o StrictHostKeyChecking=no \
  "$SCRIPT_DIR/$BACKEND_DIR/target/$JAR_NAME" \
  "$SERVER:/tmp/$JAR_NAME"
echo "✅ 파일 전송 완료"

echo "🔄 3/4. 서버에서 배포 중..."
ssh -i "$SCRIPT_DIR/$PEM_FILE" -o StrictHostKeyChecking=no "$SERVER" << EOF
  set -e

  sudo systemctl stop "$SERVICE_NAME" 2>/dev/null || true

  # 백업
  if [ -f "$REMOTE_BACKEND_DIR/$JAR_NAME" ]; then
    sudo cp "$REMOTE_BACKEND_DIR/$JAR_NAME" "$REMOTE_BACKEND_DIR/$JAR_NAME.backup"
  fi

  # 교체
  sudo mv "/tmp/$JAR_NAME" "$REMOTE_BACKEND_DIR/$JAR_NAME"
  sudo chown ubuntu:ubuntu "$REMOTE_BACKEND_DIR/$JAR_NAME"
  sudo chmod 755 "$REMOTE_BACKEND_DIR/$JAR_NAME"

  sudo systemctl start "$SERVICE_NAME"
  sleep 2
  sudo systemctl is-active "$SERVICE_NAME" --quiet && echo "✅ service running"
EOF
echo "✅ 배포 완료"

echo "🏥 4/4. 헬스체크 (도메인 기준) ..."
# nginx가 /api → backend 프록시한다는 전제
set +e
curl -s -o /dev/null -w "HEALTH HTTP %{http_code}\n" \
  "https://www.${DOMAIN}${API_PREFIX}${HEALTH_PATH}"
set -e

echo "================================"
echo "🎉 Backend 배포 완료!"
echo "🔗 https://www.${DOMAIN}"