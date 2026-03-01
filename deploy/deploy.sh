#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 공통 설정 로드 (deploy.env가 존재한다는 전제)
if [ ! -f "$SCRIPT_DIR/deploy.env" ]; then
  echo "❌ deploy.env가 없습니다: $SCRIPT_DIR/deploy.env"
  exit 1
fi

# shellcheck disable=SC1091
source "$SCRIPT_DIR/deploy.env"

echo "================================"
echo "🚀 ${PROJECT_NAME:-project} 전체 배포 시작"
echo "대상 서버: ${SERVER:-unknown}"
echo "도메인: https://www.${DOMAIN:-unknown}"
echo "================================"

# 실행 권한 보정(처음 1번만 해도 되지만, 매번 해도 무해)
chmod +x "$SCRIPT_DIR/deploy-frontend.sh" "$SCRIPT_DIR/deploy-backend.sh"

# 1) Frontend
echo ""
echo "🧩 [1/2] Frontend 배포"
"$SCRIPT_DIR/deploy-frontend.sh"

# 2) Backend
echo ""
echo "🧩 [2/2] Backend 배포"
"$SCRIPT_DIR/deploy-backend.sh"

echo ""
echo "================================"
echo "🎉 전체 배포 완료"
echo "🔗 https://www.${DOMAIN:-unknown}"
echo "================================"