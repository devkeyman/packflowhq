#!/bin/bash

# ==========================================
# EC2 Initial Setup Script for MES Application
# ==========================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 변수 설정
REPO_URL="https://github.com/your-repo/smart-factory-mes.git"  # TODO: 실제 레포지토리 URL로 변경
APP_DIR="/opt/mes"
DB_NAME="mes_db_prod"
DB_USER="mes_user"
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
    echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} ${BLUE}==>${NC} $1"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    else
        return 0
    fi
}

# 헤더
clear
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   EC2 Initial Setup for MES System    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# OS 감지
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
    log_info "Detected OS: $OS $VER"
else
    log_error "Cannot detect OS"
    exit 1
fi

# 1. 시스템 업데이트
log_step "Updating system packages..."
if [ "$OS" == "amzn" ]; then
    sudo dnf update -y
elif [ "$OS" == "ubuntu" ]; then
    sudo apt update && sudo apt upgrade -y
else
    log_error "Unsupported OS: $OS"
    exit 1
fi

# 2. 필수 패키지 설치
log_step "Installing essential packages..."
if [ "$OS" == "amzn" ]; then
    sudo dnf install -y git wget tar gzip htop vim
elif [ "$OS" == "ubuntu" ]; then
    sudo apt install -y git wget tar gzip curl htop vim
fi

# 3. Java 17 설치
log_step "Installing Java 17..."
if ! check_command java; then
    if [ "$OS" == "amzn" ]; then
        sudo dnf install -y java-17-amazon-corretto-devel
    elif [ "$OS" == "ubuntu" ]; then
        sudo apt install -y openjdk-17-jdk
    fi
else
    log_info "Java is already installed"
fi

java -version
if [ $? -ne 0 ]; then
    log_error "Java installation failed"
    exit 1
fi

# 4. MySQL 설치
log_step "Installing MySQL 8.0..."
if ! check_command mysql; then
    if [ "$OS" == "amzn" ]; then
        sudo dnf install -y mysql mysql-server
    elif [ "$OS" == "ubuntu" ]; then
        sudo apt install -y mysql-server
    fi
    
    # MySQL 서비스 시작
    sudo systemctl start mysql
    sudo systemctl enable mysql
else
    log_info "MySQL is already installed"
fi

# 5. MySQL 데이터베이스 설정
log_step "Setting up MySQL database..."
echo ""
echo "Please enter MySQL root password (press Enter if not set):"
read -s MYSQL_ROOT_PASS

if [ -z "$MYSQL_ROOT_PASS" ]; then
    MYSQL_CMD="sudo mysql"
else
    MYSQL_CMD="mysql -u root -p$MYSQL_ROOT_PASS"
fi

echo "Enter password for new database user '$DB_USER':"
read -s DB_PASSWORD

if [ -z "$DB_PASSWORD" ]; then
    log_error "Database password cannot be empty"
    exit 1
fi

# 데이터베이스 생성 스크립트
cat << EOF > /tmp/setup_db.sql
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
SELECT user FROM mysql.user;
EOF

$MYSQL_CMD < /tmp/setup_db.sql
if [ $? -eq 0 ]; then
    log_info "Database setup completed"
else
    log_warn "Database setup may have issues. Please check manually."
fi
rm /tmp/setup_db.sql

# 6. Nginx 설치
log_step "Installing Nginx..."
if ! check_command nginx; then
    if [ "$OS" == "amzn" ]; then
        sudo dnf install -y nginx
    elif [ "$OS" == "ubuntu" ]; then
        sudo apt install -y nginx
    fi
    
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    log_info "Nginx is already installed"
fi

# 7. 애플리케이션 디렉토리 생성
log_step "Creating application directories..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
mkdir -p $LOG_DIR
sudo chown $USER:$USER $LOG_DIR

# 8. Git 레포지토리 클론
log_step "Cloning repository..."
cd $APP_DIR

if [ ! -d "smart-factory-mes" ]; then
    echo ""
    echo "Enter Git repository URL (or press Enter to use default):"
    read CUSTOM_REPO_URL
    
    if [ ! -z "$CUSTOM_REPO_URL" ]; then
        REPO_URL=$CUSTOM_REPO_URL
    fi
    
    git clone $REPO_URL
    if [ $? -ne 0 ]; then
        log_error "Failed to clone repository"
        log_warn "Please clone manually later"
    else
        log_info "Repository cloned successfully"
    fi
else
    log_info "Repository already exists"
fi

# 9. 환경 변수 파일 생성
log_step "Setting up environment variables..."
cat << EOF > /tmp/mes_env
# MES Application Environment Variables
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://localhost:3306/$DB_NAME?useSSL=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASSWORD
SERVER_PORT=8080
LOG_PATH=$LOG_DIR
EOF

# JWT Secret 생성
log_info "Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
echo "JWT_SECRET=$JWT_SECRET" >> /tmp/mes_env

# 환경 변수 파일 이동
sudo mv /tmp/mes_env /etc/environment.mes
sudo chmod 600 /etc/environment.mes
log_info "Environment variables saved to /etc/environment.mes"

# 10. Systemd 서비스 파일 생성
log_step "Creating systemd service..."
sudo tee /etc/systemd/system/mes.service > /dev/null << 'EOF'
[Unit]
Description=MES Spring Boot Application
After=syslog.target network.target mysql.service

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/opt/mes/smart-factory-mes/backend
ExecStart=/usr/bin/java -jar /opt/mes/smart-factory-mes/backend/target/mes-inno-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mes

# 환경 변수
EnvironmentFile=/etc/environment.mes
Environment="JAVA_OPTS=-Xms512m -Xmx1024m"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
log_info "Systemd service created"

# 11. Nginx 설정
log_step "Configuring Nginx..."
sudo tee /etc/nginx/conf.d/mes.conf > /dev/null << 'EOF'
upstream mes_backend {
    server localhost:8080;
}

server {
    listen 80;
    server_name _;
    
    access_log /var/log/nginx/mes_access.log;
    error_log /var/log/nginx/mes_error.log;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://mes_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /health {
        proxy_pass http://mes_backend/actuator/health;
        access_log off;
    }
}
EOF

sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    log_info "Nginx configured successfully"
else
    log_error "Nginx configuration has errors"
fi

# 12. 방화벽 설정 (Ubuntu의 경우)
if [ "$OS" == "ubuntu" ]; then
    log_step "Configuring firewall..."
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 8080/tcp
    log_info "Firewall rules added (not enabled)"
fi

# 13. Swap 메모리 설정 (t3.medium 이하)
log_step "Setting up swap memory..."
if [ ! -f /swapfile ]; then
    sudo dd if=/dev/zero of=/swapfile bs=128M count=16
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
    log_info "Swap memory (2GB) added"
else
    log_info "Swap file already exists"
fi

# 14. 스크립트 권한 설정
if [ -d "$APP_DIR/smart-factory-mes/backend/scripts" ]; then
    log_step "Setting up deployment scripts..."
    chmod +x $APP_DIR/smart-factory-mes/backend/scripts/*.sh
    log_info "Deployment scripts are ready"
fi

# 15. 완료 메시지
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}    EC2 Setup Completed Successfully!   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Navigate to application directory:"
echo "   ${CYAN}cd $APP_DIR/smart-factory-mes/backend${NC}"
echo ""
echo "2. Build the application:"
echo "   ${CYAN}./mvnw clean package -DskipTests${NC}"
echo ""
echo "3. Start the service:"
echo "   ${CYAN}sudo systemctl start mes${NC}"
echo ""
echo "4. Check service status:"
echo "   ${CYAN}sudo systemctl status mes${NC}"
echo ""
echo "5. View logs:"
echo "   ${CYAN}sudo journalctl -u mes -f${NC}"
echo ""
echo -e "${YELLOW}Important Files:${NC}"
echo "  • Environment variables: /etc/environment.mes"
echo "  • Service file: /etc/systemd/system/mes.service"
echo "  • Nginx config: /etc/nginx/conf.d/mes.conf"
echo "  • Application logs: $LOG_DIR"
echo ""
echo -e "${GREEN}Database Credentials:${NC}"
echo "  • Database: $DB_NAME"
echo "  • Username: $DB_USER"
echo "  • Password: [hidden]"
echo ""
echo -e "${CYAN}Public IP: $(curl -s http://checkip.amazonaws.com)${NC}"
echo -e "${CYAN}Application URL: http://$(curl -s http://checkip.amazonaws.com)${NC}"