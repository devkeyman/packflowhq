#!/bin/bash

# MES 전체 배포 스크립트 (Backend + Frontend)
# 사용법: ./deploy-all.sh

set -e

SCRIPT_DIR="/Users/gimmunjong/Documents/programming/mes-inno"

echo "🚀 MES 전체 배포 시작"
echo "================================"
echo ""

# Backend 배포
echo "[ Backend 배포 ]"
"$SCRIPT_DIR/deploy-backend.sh"

echo ""
echo "--------------------------------"
echo ""

# Frontend 배포
echo "[ Frontend 배포 ]"
"$SCRIPT_DIR/deploy-frontend.sh"

echo ""
echo "================================"
echo "🎉 전체 배포 완료!"
echo ""
echo "🔗 사이트: https://www.innopackage.com"
echo "🔗 API: https://www.innopackage.com/api/actuator/health"
