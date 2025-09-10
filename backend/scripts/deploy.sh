#!/bin/bash

# ==========================================
# MES Application Deployment Script
# ==========================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 변수 설정
APP_NAME="mes-inno"
APP_DIR="/opt/mes/smart-factory-mes/backend"
JAR_NAME="mes-inno-0.0.1-SNAPSHOT.jar"
SERVICE_NAME="mes"
BACKUP_DIR="$APP_DIR/backups"
LOG_DIR="/var/log/mes"

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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 헤더 출력
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   MES Application Deployment Script    ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 사용자 확인
log_info "Deployment started by: $(whoami)"
log_info "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. 디렉토리 확인
log_step "Checking application directory..."
if [ ! -d "$APP_DIR" ]; then
    log_error "Application directory not found: $APP_DIR"
    exit 1
fi
cd $APP_DIR

# 2. Git 최신 코드 가져오기
log_step "Fetching latest code from Git..."
git fetch --all
CURRENT_BRANCH=$(git branch --show-current)
log_info "Current branch: $CURRENT_BRANCH"

read -p "Do you want to pull latest changes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git pull origin $CURRENT_BRANCH
    if [ $? -ne 0 ]; then
        log_error "Git pull failed!"
        exit 1
    fi
    log_info "Code updated successfully"
else
    log_warn "Skipping git pull"
fi

# 3. 백업 디렉토리 생성
log_step "Creating backup directory..."
mkdir -p $BACKUP_DIR
if [ $? -ne 0 ]; then
    log_error "Failed to create backup directory"
    exit 1
fi

# 4. 현재 JAR 백업
if [ -f "target/$JAR_NAME" ]; then
    log_step "Backing up current JAR..."
    BACKUP_FILE="$BACKUP_DIR/$APP_NAME-backup-$(date +%Y%m%d-%H%M%S).jar"
    cp target/$JAR_NAME $BACKUP_FILE
    log_info "Backup created: $BACKUP_FILE"
    
    # 오래된 백업 파일 삭제 (7일 이상)
    find $BACKUP_DIR -name "*.jar" -mtime +7 -delete
    log_info "Cleaned up old backups (older than 7 days)"
fi

# 5. Maven 빌드
log_step "Building application with Maven..."
./mvnw clean package -DskipTests -P prod

if [ $? -ne 0 ]; then
    log_error "Maven build failed!"
    exit 1
fi
log_info "Build completed successfully"

# 6. JAR 파일 확인
if [ ! -f "target/$JAR_NAME" ]; then
    log_error "JAR file not found after build"
    exit 1
fi

# 7. 서비스 상태 확인
log_step "Checking service status..."
if systemctl is-active --quiet $SERVICE_NAME; then
    log_info "Service is currently running"
    SERVICE_WAS_RUNNING=true
else
    log_warn "Service is not running"
    SERVICE_WAS_RUNNING=false
fi

# 8. 서비스 중지
if [ "$SERVICE_WAS_RUNNING" = true ]; then
    log_step "Stopping service..."
    sudo systemctl stop $SERVICE_NAME
    
    # 완전히 중지될 때까지 대기
    sleep 3
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        log_error "Failed to stop service"
        exit 1
    fi
    log_info "Service stopped successfully"
fi

# 9. 로그 로테이션
log_step "Rotating logs..."
if [ -f "$LOG_DIR/mes-prod.log" ]; then
    mv $LOG_DIR/mes-prod.log $LOG_DIR/mes-prod-$(date +%Y%m%d-%H%M%S).log
    log_info "Log file rotated"
fi

# 10. 서비스 시작
log_step "Starting service..."
sudo systemctl start $SERVICE_NAME

# 11. 서비스 시작 확인 (최대 30초 대기)
log_step "Waiting for service to start..."
for i in {1..30}; do
    if systemctl is-active --quiet $SERVICE_NAME; then
        log_info "Service started successfully"
        break
    fi
    
    if [ $i -eq 30 ]; then
        log_error "Service failed to start within 30 seconds"
        log_error "Check logs: sudo journalctl -u $SERVICE_NAME -n 100"
        exit 1
    fi
    
    echo -n "."
    sleep 1
done
echo ""

# 12. 헬스체크
log_step "Performing health check..."
sleep 5  # 애플리케이션 초기화 대기

HEALTH_CHECK_URL="http://localhost:8080/actuator/health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)

if [ "$HTTP_STATUS" = "200" ]; then
    log_info "Health check passed (HTTP $HTTP_STATUS)"
else
    log_warn "Health check returned HTTP $HTTP_STATUS"
    log_warn "Application may still be initializing..."
fi

# 13. 최종 상태 출력
echo ""
log_step "Deployment Summary:"
echo "----------------------------------------"
sudo systemctl status $SERVICE_NAME --no-pager | head -n 5
echo "----------------------------------------"

# 14. 로그 미리보기
log_step "Recent logs:"
sudo journalctl -u $SERVICE_NAME -n 10 --no-pager

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deployment Completed Successfully!   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
log_info "Application URL: http://$(hostname -I | awk '{print $1}'):8080"
log_info "Check logs: sudo journalctl -u $SERVICE_NAME -f"