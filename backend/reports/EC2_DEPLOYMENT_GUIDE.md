# AWS EC2 배포 가이드

## 📋 사전 준비 사항

### AWS 계정 및 EC2 인스턴스
- AWS 계정
- EC2 인스턴스 (권장: t3.medium 이상)
- 탄력적 IP 주소
- 보안 그룹 설정 (포트 22, 80, 443, 8080 열기)

### 필요한 도구
- SSH 클라이언트
- AWS CLI (선택사항)
- Git

## 🚀 EC2 인스턴스 설정

### 1. EC2 인스턴스 생성

#### 인스턴스 사양 권장사항
- **AMI**: Amazon Linux 2023 또는 Ubuntu 22.04 LTS
- **인스턴스 유형**: t3.medium (최소), t3.large (권장)
- **스토리지**: 20GB 이상 SSD (gp3)
- **네트워크**: VPC 및 서브넷 설정

#### 보안 그룹 규칙
```
인바운드 규칙:
- SSH (22): 내 IP
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
- Custom TCP (8080): 0.0.0.0/0 (개발 중에만)
- MySQL (3306): 동일 VPC 내부만
```

### 2. EC2 접속
```bash
# PEM 파일 권한 설정
chmod 400 your-key.pem

# SSH 접속
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

## 📦 서버 환경 설정

### 1. 시스템 업데이트 및 필수 패키지 설치

#### Amazon Linux 2023
```bash
# 시스템 업데이트
sudo dnf update -y

# 필수 패키지 설치
sudo dnf install -y git wget tar gzip
```

#### Ubuntu 22.04
```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
sudo apt install -y git wget tar gzip curl
```

### 2. Java 17 설치

#### Amazon Linux 2023
```bash
# Corretto 17 설치
sudo dnf install -y java-17-amazon-corretto-devel

# 설치 확인
java -version
```

#### Ubuntu 22.04
```bash
# OpenJDK 17 설치
sudo apt install -y openjdk-17-jdk

# 설치 확인
java -version
```

### 3. MySQL 8.0 설치 및 설정

#### Amazon Linux 2023
```bash
# MySQL 8.0 설치
sudo dnf install -y mysql mysql-server

# MySQL 서비스 시작
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 보안 설정
sudo mysql_secure_installation
```

#### Ubuntu 22.04
```bash
# MySQL 8.0 설치
sudo apt install -y mysql-server

# MySQL 서비스 시작
sudo systemctl start mysql
sudo systemctl enable mysql

# 보안 설정
sudo mysql_secure_installation
```

#### 데이터베이스 생성
```sql
sudo mysql -u root -p

CREATE DATABASE mes_db_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mes_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON mes_db_prod.* TO 'mes_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Maven 설치

#### Amazon Linux 2023
```bash
# Maven 설치
sudo dnf install -y maven

# 설치 확인
mvn -version
```

#### Ubuntu 22.04
```bash
# Maven 설치
sudo apt install -y maven

# 설치 확인
mvn -version
```

#### Maven Wrapper 생성 (프로젝트에 mvnw가 없는 경우)
```bash
# 프로젝트 디렉토리로 이동
cd /opt/mes/smart-factory-mes/backend

# Maven Wrapper 생성
mvn wrapper:wrapper

# 실행 권한 부여
chmod +x mvnw

# .mvn 디렉토리가 생성되었는지 확인
ls -la .mvn/wrapper/
```

### 5. Nginx 설치 (리버스 프록시)

#### Amazon Linux 2023
```bash
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Ubuntu 22.04
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 🔨 애플리케이션 배포

### 1. 프로젝트 클론 및 빌드
```bash
# 애플리케이션 디렉토리 생성
sudo mkdir -p /opt/mes
sudo chown ec2-user:ec2-user /opt/mes
cd /opt/mes

# Git 클론
git clone https://github.com/your-repo/smart-factory-mes.git
cd smart-factory-mes/backend

# Maven Wrapper 권한 설정
chmod +x mvnw

# 빌드
./mvnw clean package -DskipTests
```

### 2. 환경 변수 설정
```bash
# 환경 변수 파일 생성
sudo vi /etc/environment

# 다음 내용 추가
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://localhost:3306/mes_db_prod?useSSL=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=mes_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your-production-secret-key-must-be-very-long-and-secure
SERVER_PORT=8080
LOG_PATH=/var/log/mes
```

### 3. 로그 디렉토리 생성
```bash
sudo mkdir -p /var/log/mes
sudo chown ec2-user:ec2-user /var/log/mes
```

### 4. Systemd 서비스 등록
```bash
# 서비스 파일 생성
sudo vi /etc/systemd/system/mes.service
```

서비스 파일 내용:
```ini
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
Environment="SPRING_PROFILES_ACTIVE=prod"
EnvironmentFile=/etc/environment

# 메모리 설정
Environment="JAVA_OPTS=-Xms512m -Xmx1024m"

[Install]
WantedBy=multi-user.target
```

### 5. 서비스 시작
```bash
# 서비스 리로드
sudo systemctl daemon-reload

# 서비스 시작
sudo systemctl start mes

# 서비스 자동 시작 설정
sudo systemctl enable mes

# 상태 확인
sudo systemctl status mes

# 로그 확인
sudo journalctl -u mes -f
```

## 🔒 Nginx 리버스 프록시 설정

### Nginx 설정 파일 생성
```bash
sudo vi /etc/nginx/conf.d/mes.conf
```

설정 내용:
```nginx
upstream mes_backend {
    server localhost:8080;
}

server {
    listen 80;
    server_name your-domain.com;  # 실제 도메인으로 변경
    
    # 로그 설정
    access_log /var/log/nginx/mes_access.log;
    error_log /var/log/nginx/mes_error.log;
    
    # 최대 업로드 크기
    client_max_body_size 100M;
    
    # 프록시 설정
    location / {
        proxy_pass http://mes_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # WebSocket 지원 (필요시)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
    
    # 정적 리소스 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        proxy_pass http://mes_backend;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # 헬스체크 엔드포인트
    location /health {
        proxy_pass http://mes_backend/actuator/health;
        access_log off;
    }
}
```

### Nginx 재시작
```bash
# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

## 🔐 SSL/TLS 설정 (Let's Encrypt)

### Certbot 설치 및 인증서 발급
```bash
# Amazon Linux 2023
sudo dnf install -y certbot python3-certbot-nginx

# Ubuntu 22.04
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo systemctl enable certbot-renew.timer
```

## 🚦 배포 스크립트

### 자동 배포 스크립트 생성
```bash
vi /opt/mes/deploy.sh
```

스크립트 내용:
```bash
#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}MES 애플리케이션 배포 시작${NC}"
echo -e "${GREEN}========================================${NC}"

# 변수 설정
APP_DIR="/opt/mes/smart-factory-mes/backend"
SERVICE_NAME="mes"

# Git 최신 코드 가져오기
echo -e "${YELLOW}Git Pull...${NC}"
cd $APP_DIR
git pull origin main

# 빌드
echo -e "${YELLOW}Building application...${NC}"
./mvnw clean package -DskipTests

if [ $? -ne 0 ]; then
    echo -e "${RED}빌드 실패!${NC}"
    exit 1
fi

# 기존 서비스 중지
echo -e "${YELLOW}Stopping service...${NC}"
sudo systemctl stop $SERVICE_NAME

# 백업 (선택사항)
echo -e "${YELLOW}Creating backup...${NC}"
sudo cp target/mes-inno-0.0.1-SNAPSHOT.jar target/mes-inno-backup-$(date +%Y%m%d-%H%M%S).jar

# 서비스 시작
echo -e "${YELLOW}Starting service...${NC}"
sudo systemctl start $SERVICE_NAME

# 상태 확인
sleep 5
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}배포 완료! 서비스가 정상적으로 실행 중입니다.${NC}"
    sudo systemctl status $SERVICE_NAME --no-pager
else
    echo -e "${RED}배포 실패! 로그를 확인하세요.${NC}"
    sudo journalctl -u $SERVICE_NAME -n 50 --no-pager
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}배포 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
```

실행 권한 부여:
```bash
chmod +x /opt/mes/deploy.sh
```

## 📊 모니터링

### 1. 애플리케이션 로그 확인
```bash
# 실시간 로그
sudo journalctl -u mes -f

# 최근 100줄
sudo journalctl -u mes -n 100

# 특정 시간 범위
sudo journalctl -u mes --since "2024-01-01" --until "2024-01-02"
```

### 2. 시스템 리소스 모니터링
```bash
# CPU, 메모리 사용률
top
htop  # 더 나은 UI (설치 필요)

# 디스크 사용량
df -h

# 네트워크 연결
netstat -tuln
```

### 3. 헬스체크 URL
```bash
# 로컬에서 확인
curl http://localhost:8080/actuator/health

# 외부에서 확인
curl http://your-domain.com/health
```

## 🔧 트러블슈팅

### 서비스가 시작되지 않는 경우
```bash
# 상세 로그 확인
sudo journalctl -xe -u mes

# 포트 사용 확인
sudo lsof -i :8080

# 환경 변수 확인
printenv | grep -E "(DB_|JWT_|SPRING_)"
```

### 메모리 부족 문제
```bash
# Swap 메모리 추가 (t3.medium 이하에서 권장)
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구 적용
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

### 데이터베이스 연결 실패
```bash
# MySQL 상태 확인
sudo systemctl status mysql

# 연결 테스트
mysql -u mes_user -p -h localhost mes_db_prod

# 방화벽 확인
sudo iptables -L
```

## 🔄 롤백 절차

문제 발생 시 이전 버전으로 롤백:
```bash
#!/bin/bash
# rollback.sh

BACKUP_JAR=$(ls -t /opt/mes/smart-factory-mes/backend/target/mes-inno-backup-*.jar | head -1)

if [ -z "$BACKUP_JAR" ]; then
    echo "백업 파일이 없습니다!"
    exit 1
fi

echo "롤백 시작: $BACKUP_JAR"
sudo systemctl stop mes
cp $BACKUP_JAR /opt/mes/smart-factory-mes/backend/target/mes-inno-0.0.1-SNAPSHOT.jar
sudo systemctl start mes
echo "롤백 완료!"
```

## 📝 체크리스트

- [ ] EC2 인스턴스 생성 및 보안 그룹 설정
- [ ] Java 17 설치
- [ ] MySQL 8.0 설치 및 데이터베이스 생성
- [ ] Nginx 설치 및 설정
- [ ] 프로젝트 클론 및 빌드
- [ ] 환경 변수 설정
- [ ] Systemd 서비스 등록
- [ ] SSL 인증서 설정 (운영 환경)
- [ ] 모니터링 설정
- [ ] 백업 정책 수립

## 🆘 지원

문제가 발생하면 다음을 확인하세요:
1. 애플리케이션 로그: `sudo journalctl -u mes -f`
2. Nginx 로그: `/var/log/nginx/mes_error.log`
3. MySQL 로그: `/var/log/mysql/error.log`
4. 시스템 로그: `/var/log/syslog` 또는 `/var/log/messages`