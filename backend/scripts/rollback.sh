#!/bin/bash

# ==========================================
# MES Application Rollback Script
# ==========================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 변수 설정
APP_DIR="/opt/mes/smart-factory-mes/backend"
JAR_NAME="mes-inno-0.0.1-SNAPSHOT.jar"
SERVICE_NAME="mes"
BACKUP_DIR="$APP_DIR/backups"

# 함수 정의
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 헤더 출력
echo -e "${RED}========================================${NC}"
echo -e "${RED}    MES Application Rollback Script     ${NC}"
echo -e "${RED}========================================${NC}"
echo ""

# 백업 파일 목록 표시
log_info "Available backup files:"
echo "----------------------------------------"
ls -lht $BACKUP_DIR/*.jar 2>/dev/null | head -10

if [ $? -ne 0 ]; then
    log_error "No backup files found in $BACKUP_DIR"
    exit 1
fi
echo "----------------------------------------"

# 백업 파일 선택
echo ""
echo "Select rollback option:"
echo "1) Use latest backup"
echo "2) Select specific backup"
echo "3) Cancel"
read -p "Enter option (1-3): " option

case $option in
    1)
        BACKUP_FILE=$(ls -t $BACKUP_DIR/*.jar 2>/dev/null | head -1)
        if [ -z "$BACKUP_FILE" ]; then
            log_error "No backup file found"
            exit 1
        fi
        ;;
    2)
        echo "Enter backup filename (from the list above):"
        read filename
        BACKUP_FILE="$BACKUP_DIR/$filename"
        if [ ! -f "$BACKUP_FILE" ]; then
            log_error "Backup file not found: $BACKUP_FILE"
            exit 1
        fi
        ;;
    3)
        log_info "Rollback cancelled"
        exit 0
        ;;
    *)
        log_error "Invalid option"
        exit 1
        ;;
esac

# 확인
echo ""
log_warn "You are about to rollback to:"
log_warn "  $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    log_info "Rollback cancelled"
    exit 0
fi

# 롤백 시작
echo ""
log_info "Starting rollback process..."

# 1. 현재 JAR 백업 (롤백 실패 시 복구용)
if [ -f "$APP_DIR/target/$JAR_NAME" ]; then
    log_info "Backing up current JAR before rollback..."
    cp $APP_DIR/target/$JAR_NAME $APP_DIR/target/${JAR_NAME}.rollback-temp
fi

# 2. 서비스 중지
log_info "Stopping service..."
sudo systemctl stop $SERVICE_NAME

# 대기
sleep 3

# 3. JAR 파일 교체
log_info "Replacing JAR file..."
cp $BACKUP_FILE $APP_DIR/target/$JAR_NAME

if [ $? -ne 0 ]; then
    log_error "Failed to copy backup file"
    
    # 원본 복구
    if [ -f "$APP_DIR/target/${JAR_NAME}.rollback-temp" ]; then
        cp $APP_DIR/target/${JAR_NAME}.rollback-temp $APP_DIR/target/$JAR_NAME
    fi
    
    sudo systemctl start $SERVICE_NAME
    exit 1
fi

# 4. 서비스 시작
log_info "Starting service..."
sudo systemctl start $SERVICE_NAME

# 5. 서비스 시작 확인
log_info "Waiting for service to start..."
for i in {1..30}; do
    if systemctl is-active --quiet $SERVICE_NAME; then
        log_info "Service started successfully"
        break
    fi
    
    if [ $i -eq 30 ]; then
        log_error "Service failed to start"
        
        # 롤백 실패 시 원본 복구 시도
        log_warn "Attempting to restore previous version..."
        if [ -f "$APP_DIR/target/${JAR_NAME}.rollback-temp" ]; then
            cp $APP_DIR/target/${JAR_NAME}.rollback-temp $APP_DIR/target/$JAR_NAME
            sudo systemctl start $SERVICE_NAME
        fi
        
        exit 1
    fi
    
    echo -n "."
    sleep 1
done
echo ""

# 6. 임시 파일 정리
rm -f $APP_DIR/target/${JAR_NAME}.rollback-temp

# 7. 헬스체크
log_info "Performing health check..."
sleep 5

HEALTH_CHECK_URL="http://localhost:8080/actuator/health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)

if [ "$HTTP_STATUS" = "200" ]; then
    log_info "Health check passed (HTTP $HTTP_STATUS)"
else
    log_warn "Health check returned HTTP $HTTP_STATUS"
fi

# 8. 상태 출력
echo ""
echo "----------------------------------------"
sudo systemctl status $SERVICE_NAME --no-pager | head -n 5
echo "----------------------------------------"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}    Rollback Completed Successfully!    ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
log_info "Rolled back to: $(basename $BACKUP_FILE)"
log_info "Check logs: sudo journalctl -u $SERVICE_NAME -f"