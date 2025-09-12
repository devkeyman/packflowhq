# Smart Factory MES (Manufacturing Execution System)

스마트 팩토리를 위한 제조 실행 시스템(MES) - 생산 관리, 작업 지시, 품질 이슈 추적을 위한 통합 플랫폼

## 📋 프로젝트 개요

Smart Factory MES는 제조 현장의 생산 활동을 실시간으로 모니터링하고 관리하는 웹 기반 시스템입니다. 작업 지시서 관리, 생산 진행 상황 추적, 품질 이슈 관리 등의 기능을 제공하여 제조 현장의 효율성을 극대화합니다.

### 🎯 Quick Start (빠른 시작)

```bash
# 1. 프로젝트 클론
git clone https://github.com/devkeyman/mes-inno.git
cd mes-inno

# 2. Backend 실행
cd backend
./mvnw spring-boot:run

# 3. Frontend 실행 (새 터미널)
cd frontend
npm install && npm run dev

# 4. 브라우저에서 http://localhost:5173 접속
```

### 주요 기능

- **사용자 인증 및 권한 관리**: JWT 기반 인증, 역할별 접근 제어 (관리자/매니저/작업자)
- **작업 지시서 관리**: 작업 생성, 할당, 진행 상황 추적, 완료 처리
- **생산 모니터링**: 실시간 생산 현황 대시보드, 생산 통계 및 리포트
- **품질 이슈 관리**: 이슈 보고, 추적, 해결 프로세스 관리
- **작업 로그**: 모든 작업 활동 기록 및 추적

## 🚀 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Architecture**: Hexagonal Architecture (Port & Adapter Pattern)

### Frontend
- **Framework**: React 19.1.1 + TypeScript 5.9.2
- **Build Tool**: Vite 7.1.0
- **Routing**: React Router DOM 7.8.0
- **State Management**: Zustand 5.0.7 + TanStack React Query 5.84.2
- **HTTP Client**: Axios 1.11.0
- **UI Components**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Architecture**: Feature-Sliced Design (FSD)

## 📁 프로젝트 구조

```
mes-inno/
├── backend/                    # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mes/
│   │   │   │   ├── adapter/       # 어댑터 레이어 (Web, Persistence)
│   │   │   │   ├── application/   # 애플리케이션 레이어 (UseCase, Service)
│   │   │   │   ├── domain/        # 도메인 레이어 (Model, Service)
│   │   │   │   ├── config/        # 설정 클래스
│   │   │   │   └── common/        # 공통 컴포넌트 (DTO, Exception, Mapper)
│   │   │   └── resources/
│   │   │       ├── application*.yml
│   │   │       └── static/        # 빌드된 프론트엔드 파일
│   │   └── test/
│   ├── scripts/                # 배포 스크립트
│   └── pom.xml
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── app/               # 앱 설정 (라우터, 레이아웃)
│   │   ├── entities/          # 비즈니스 엔티티
│   │   ├── features/          # 기능 모듈
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── shared/            # 공유 컴포넌트 및 유틸리티
│   │   └── widgets/           # UI 위젯
│   ├── package.json
│   └── vite.config.ts
│
└── scripts/                    # 유틸리티 스크립트
```

## 🛠️ 로컬 개발 환경 설정

### 사전 요구사항

- **Java 17** 이상 ([다운로드](https://adoptium.net/))
- **Node.js 18** 이상 ([다운로드](https://nodejs.org/))
- **MySQL 8.0** 이상 ([다운로드](https://dev.mysql.com/downloads/))
- **Maven 3.6** 이상 ([다운로드](https://maven.apache.org/download.cgi))
- **Git** ([다운로드](https://git-scm.com/downloads))

### 1. 프로젝트 클론

```bash
# 저장소 클론
git clone https://github.com/devkeyman/mes-inno.git
cd mes-inno
```

### 2. 데이터베이스 설정

```bash
# MySQL 데이터베이스 생성
mysql -u root -p

CREATE DATABASE mes_db_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'inno0000';
GRANT ALL PRIVILEGES ON mes_db_dev.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend 설정 및 실행

```bash
cd backend

# application-dev.yml 생성 (개발 환경 설정)
cp src/main/resources/application.yml src/main/resources/application-dev.yml

# application-dev.yml 파일을 열어 데이터베이스 정보 수정
# spring.datasource.username과 password를 위에서 생성한 계정으로 변경

# Maven Wrapper 생성 (처음 한 번만)
mvn wrapper:wrapper
chmod +x mvnw

# 의존성 설치 및 빌드
./mvnw clean install

# 애플리케이션 실행 (개발 모드)
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

✅ 백엔드 서버가 http://localhost:8080 에서 실행됩니다.

### 4. Frontend 설정 및 실행

```bash
# 새 터미널을 열고 프로젝트 루트에서
cd frontend

# 환경 변수 파일 생성
echo "VITE_API_URL=http://localhost:8080" > .env.development

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

✅ 프론트엔드가 http://localhost:5173 에서 실행됩니다.

### 5. 개발 환경 확인

1. **Frontend 접속**: http://localhost:5173
2. **Backend API 확인**: http://localhost:8080/actuator/health
3. **테스트 로그인**:
   - Admin: `admin@mes.com` / `admin123`
   - Manager: `manager@mes.com` / `manager123`
   - Worker: `worker@mes.com` / `worker123`

## 🚢 프로덕션 배포 가이드

### 배포 옵션

#### 옵션 1: Ubuntu EC2 배포 (AWS)
#### 옵션 2: Docker 배포
#### 옵션 3: Kubernetes 배포

---

## 📦 Ubuntu EC2 배포 (상세 가이드)

### 사전 준비

#### 1. AWS 계정 및 EC2 인스턴스 준비

- **인스턴스 타입**: t3.small 이상 권장 (최소 2GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **스토리지**: 20GB 이상
- **보안 그룹 인바운드 규칙**:
  - SSH (22): 관리자 IP
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0
  - Spring Boot (8080): VPC 내부만 (선택사항)

#### 2. 도메인 준비 (선택사항)
- Route 53 또는 외부 도메인 제공업체에서 도메인 구매
- EC2 Elastic IP와 도메인 연결

### 배포 단계별 가이드

#### Step 1: EC2 인스턴스 접속

```bash
# PEM 파일 권한 설정
chmod 400 your-key.pem

# SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# 접속 확인
whoami  # ubuntu가 출력되어야 함
```

#### Step 2: 소스 코드 클론

```bash
# Git이 설치되어 있지 않은 경우 먼저 설치
sudo apt update
sudo apt install -y git

# 프로젝트 디렉토리 생성
sudo mkdir -p /opt/mes
sudo chown ubuntu:ubuntu /opt/mes
cd /opt/mes

# GitHub에서 소스 코드 클론
git clone https://github.com/devkeyman/mes-inno.git
cd mes-inno

# 특정 브랜치를 클론하려는 경우
git clone -b branch-name https://github.com/devkeyman/mes-inno.git

# Private 저장소인 경우 (Personal Access Token 사용)
git clone https://your-token@github.com/devkeyman/mes-inno.git
```

#### Step 3: 필수 소프트웨어 설치

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Java 17 설치
sudo apt install -y openjdk-17-jdk

# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL 8.0 설치
sudo apt install -y mysql-server

# Nginx 설치
sudo apt install -y nginx

# Git 설치
sudo apt install -y git

# 설치 확인
java -version
node -v
mysql --version
nginx -v
```

#### Step 4: MySQL 데이터베이스 설정

```bash
# MySQL 보안 설정
sudo mysql_secure_installation

# MySQL 접속
sudo mysql -u root -p

# 데이터베이스 및 사용자 생성
CREATE DATABASE mes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mes_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON mes_db.* TO 'mes_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: 프로젝트 빌드 및 배포

```bash
# 이미 클론한 프로젝트 디렉토리로 이동
cd /opt/mes/mes-inno

# Frontend 빌드
cd frontend
npm install
npm run build

# Backend static 리소스로 복사
cd ../backend
rm -rf src/main/resources/static/*
cp -r ../frontend/dist/* src/main/resources/static/

# application-prod.yml 설정
cat > src/main/resources/application-prod.yml << EOF
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mes_db
    username: mes_user
    password: your_secure_password
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

server:
  port: 8080

logging:
  level:
    root: INFO
EOF

# Maven Wrapper 생성 및 빌드
mvn wrapper:wrapper
chmod +x mvnw
./mvnw clean package -DskipTests
```

#### Step 6: Systemd 서비스 등록

```bash
# 서비스 파일 생성
sudo tee /etc/systemd/system/mes.service << EOF
[Unit]
Description=Smart Factory MES
After=syslog.target mysql.service

[Service]
User=ubuntu
WorkingDirectory=/opt/mes/mes-inno/backend
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/mes/mes-inno/backend/target/mes-inno-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
StandardOutput=journal
StandardError=journal
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 서비스 시작
sudo systemctl daemon-reload
sudo systemctl enable mes
sudo systemctl start mes
sudo systemctl status mes
```

#### Step 7: Nginx 리버스 프록시 설정

```bash
# Nginx 설정 파일 생성
sudo tee /etc/nginx/sites-available/mes << EOF
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket 지원 (필요시)
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# 사이트 활성화
sudo ln -s /etc/nginx/sites-available/mes /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 8: SSL 인증서 설정 (HTTPS)

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo systemctl enable certbot.timer
```

#### Step 9: 배포 확인 및 테스트

```bash
# 1. 서비스 상태 확인
sudo systemctl status mes
sudo systemctl status nginx

# 2. 애플리케이션 헬스체크
curl http://localhost:8080/actuator/health

# 3. 웹 브라우저에서 접속 확인
# http://your-domain.com 또는 http://your-ec2-public-ip

# 4. 로그 확인 (문제 발생 시)
sudo journalctl -u mes -n 50
sudo tail -f /var/log/nginx/error.log
```

---

## 🐳 Docker 배포 (간편 배포)

### Docker Compose를 이용한 배포

```bash
# 프로젝트 클론
git clone https://github.com/devkeyman/mes-inno.git
cd mes-inno

# docker-compose.yml 파일 생성
cat > docker-compose.yml << EOF
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: mes_db
      MYSQL_USER: mes_user
      MYSQL_PASSWORD: mes123
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/mes_db
      SPRING_DATASOURCE_USERNAME: mes_user
      SPRING_DATASOURCE_PASSWORD: mes123
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
EOF

# Docker Compose 실행
docker-compose up -d
```

---

## 🔨 유용한 스크립트

### 자동 빌드 스크립트

```bash
# backend/scripts/build.sh 실행
cd backend/scripts
./build.sh
```

### 자동 배포 스크립트

```bash
# backend/scripts/deploy-ec2.sh 실행
cd backend/scripts
./deploy-ec2.sh prod
```

## 📊 운영 및 모니터링

### 실시간 모니터링

```bash
# 서비스 상태 모니터링
watch -n 2 'sudo systemctl status mes nginx mysql'

# 리소스 사용량 모니터링
htop  # 또는 top

# 디스크 사용량 확인
df -h

# 메모리 사용량 확인
free -h

# 애플리케이션 로그 실시간 확인
sudo journalctl -u mes -f

# Nginx 액세스 로그 실시간 확인
sudo tail -f /var/log/nginx/access.log
```

### 로그 관리

```bash
# 특정 기간 로그 조회
sudo journalctl -u mes --since "2024-01-01" --until "2024-01-02"

# 에러 로그만 필터링
sudo journalctl -u mes -p err

# 로그 파일 로테이션 설정
sudo nano /etc/logrotate.d/mes
```

### 백업 전략

```bash
# 데이터베이스 백업
mysqldump -u mes_user -p mes_db > backup_$(date +%Y%m%d).sql

# 자동 백업 스크립트 (crontab에 추가)
0 2 * * * mysqldump -u mes_user -p'password' mes_db > /backup/mes_db_$(date +\%Y\%m\%d).sql
```

## 🔄 경로 마이그레이션 가이드

### /mes에서 /opt/mes로 이동

EC2 인스턴스에서 기존 `/mes` 경로를 `/opt/mes`로 이동해야 하는 경우:

#### 자동 마이그레이션 스크립트

```bash
#!/bin/bash
# migrate_to_opt.sh

# 1. 백업 생성
sudo systemctl stop mes
sudo tar -czf ~/mes_backup_$(date +%Y%m%d_%H%M%S).tar.gz /mes

# 2. 디렉토리 이동
[ -d "/opt/mes" ] && sudo mv /opt/mes /opt/mes_old_$(date +%Y%m%d)
sudo mv /mes /opt/mes

# 3. 서비스 설정 업데이트
sudo sed -i 's|/mes/|/opt/mes/|g' /etc/systemd/system/mes.service
[ -f "/etc/nginx/sites-available/mes" ] && sudo sed -i 's|/mes/|/opt/mes/|g' /etc/nginx/sites-available/mes

# 4. 권한 설정
sudo chown -R ubuntu:ubuntu /opt/mes
chmod +x /opt/mes/mes-inno/backend/mvnw

# 5. 서비스 재시작
sudo systemctl daemon-reload
sudo systemctl start mes
sudo systemctl restart nginx

echo "마이그레이션 완료! 새 경로: /opt/mes"
```

### /opt/mes 디렉토리 재생성

기존 `/opt/mes`를 완전히 삭제하고 새로 설치하는 경우:

#### 디렉토리 재생성 스크립트

```bash
#!/bin/bash
# recreate_opt_mes.sh

echo "⚠️  경고: /opt/mes가 완전히 삭제됩니다!"
read -p "계속하시겠습니까? (yes/no): " response

if [[ "$response" == "yes" ]]; then
    # 1. 백업
    [ -d "/opt/mes" ] && sudo tar -czf ~/opt_mes_backup_$(date +%Y%m%d_%H%M%S).tar.gz /opt/mes
    
    # 2. 서비스 중지
    sudo systemctl stop mes
    
    # 3. 디렉토리 삭제 및 재생성
    sudo rm -rf /opt/mes
    sudo mkdir -p /opt/mes
    sudo chown ubuntu:ubuntu /opt/mes
    
    # 4. 프로젝트 클론
    cd /opt/mes
    git clone https://github.com/devkeyman/mes-inno.git
    cd mes-inno
    
    # 5. 빌드 및 설정
    cd backend
    ./mvnw clean package -DskipTests
    
    # 6. 서비스 재시작
    sudo systemctl start mes
    
    echo "✅ 재생성 완료!"
fi
```

#### 수동 단계별 실행

```bash
# Step 1: 백업
sudo tar -czf ~/opt_mes_backup_$(date +%Y%m%d).tar.gz /opt/mes

# Step 2: 서비스 중지
sudo systemctl stop mes

# Step 3: 삭제
sudo rm -rf /opt/mes

# Step 4: 재생성
sudo mkdir -p /opt/mes
sudo chown ubuntu:ubuntu /opt/mes

# Step 5: 클론
cd /opt/mes
git clone https://github.com/devkeyman/mes-inno.git

# Step 6: 권한 설정
chmod +x /opt/mes/mes-inno/backend/mvnw

# Step 7: 서비스 시작
sudo systemctl start mes
```

## 🔧 트러블슈팅 가이드

### 자주 발생하는 문제와 해결 방법

#### 1. 포트 충돌 문제

```bash
# 증상: "Address already in use" 에러
# 해결:
sudo lsof -i :8080  # 포트 사용 프로세스 확인
sudo kill -9 <PID>  # 프로세스 종료
sudo systemctl restart mes  # 서비스 재시작
```

#### 2. 메모리 부족 (t3.micro)

```bash
# 증상: "OutOfMemoryError" 또는 서비스 중단
# 해결: Swap 메모리 추가
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# JVM 메모리 설정 조정
sudo nano /etc/systemd/system/mes.service
# ExecStart에 -Xmx512m -Xms256m 추가
```

#### 3. MySQL 연결 실패

```bash
# 증상: "Communications link failure"
# 해결:
sudo systemctl status mysql  # MySQL 상태 확인
sudo systemctl restart mysql  # MySQL 재시작

# 연결 테스트
mysql -u mes_user -p -h localhost mes_db

# 권한 확인
SHOW GRANTS FOR 'mes_user'@'localhost';
```

#### 4. Nginx 502 Bad Gateway

```bash
# 증상: 브라우저에서 502 에러
# 해결:
sudo systemctl status mes  # Backend 서비스 확인
sudo systemctl restart mes  # Backend 재시작
sudo nginx -t  # Nginx 설정 검증
sudo systemctl restart nginx  # Nginx 재시작
```

#### 5. 파일 권한 문제

```bash
# 증상: "Permission denied" 에러
# 해결:
sudo chown -R ubuntu:ubuntu /opt/mes
chmod +x backend/mvnw
chmod 755 backend/scripts/*.sh
```

## 👤 사용자 권한

| 역할 | 권한 |
|------|------|
| **ADMIN** | 시스템 전체 관리, 사용자 관리, 모든 데이터 접근 |
| **MANAGER** | 작업 지시서 관리, 이슈 할당, 보고서 조회 |
| **WORKER** | 할당된 작업 수행, 이슈 보고, 작업 로그 작성 |

### 테스트 계정
- Admin: `admin@mes.com` / `admin123`
- Manager: `manager@mes.com` / `manager123`
- Worker: `worker@mes.com` / `worker123`

## 📝 API 문서

주요 API 엔드포인트:
- `/api/auth/*` - 인증 관련
- `/api/users/*` - 사용자 관리
- `/api/work-orders/*` - 작업 지시서 관리
- `/api/issues/*` - 이슈 관리
- `/api/dashboard/*` - 대시보드 통계
- `/api/work-logs/*` - 작업 로그

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

## 🚀 성능 최적화 팁

### Backend 최적화
- JVM 힙 메모리 조정: `-Xmx1g -Xms512m`
- 데이터베이스 커넥션 풀 설정: `spring.datasource.hikari.maximum-pool-size=20`
- 캐싱 활성화: Spring Cache 또는 Redis 사용

### Frontend 최적화
- 프로덕션 빌드: `npm run build`
- Gzip 압축 활성화 (Nginx)
- 이미지 최적화 및 Lazy Loading

### 데이터베이스 최적화
- 인덱스 생성: 자주 조회되는 컬럼
- 쿼리 최적화: EXPLAIN 분석
- 정기적인 백업 및 정리

## 📚 추가 리소스

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [React 공식 문서](https://react.dev)
- [Docker 가이드](https://docs.docker.com)
- [AWS EC2 문서](https://docs.aws.amazon.com/ec2/)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 문의

프로젝트 관련 문의사항은 이슈 트래커를 통해 등록해 주세요.

---

💡 **Pro Tip**: 개발 환경 설정 시 문제가 발생하면 `./mvnw clean` (Backend) 또는 `rm -rf node_modules && npm install` (Frontend)를 실행해보세요.