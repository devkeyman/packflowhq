# Smart Factory MES - EC2 배포 가이드

## 사전 준비사항
- EC2 인스턴스 (Amazon Linux 2 또는 Ubuntu 20.04+)
- Java 17+
- Node.js 18+
- MySQL 8.0+ (RDS 권장)
- Maven 3.6+ 또는 Gradle

## 1. EC2 인스턴스 설정

### 1.1 보안 그룹 설정
```
- 인바운드 규칙:
  - SSH (22): 관리자 IP만
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0  
  - Spring Boot (8080): 필요시
```

### 1.2 필수 소프트웨어 설치
```bash
# Java 17 설치
sudo yum install java-17-amazon-corretto -y

# Node.js 18 설치
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Git 설치
sudo yum install git -y
```

## 2. 프로젝트 빌드 및 배포

### 2.1 소스 코드 클론
```bash
git clone https://github.com/your-repo/smart-factory-mes.git
cd smart-factory-mes
```

### 2.2 Frontend 빌드 및 Backend 통합
```bash
# Frontend 빌드
cd frontend
npm install
npm run build

# Backend static 리소스로 복사
cd ../backend
rm -rf src/main/resources/static/*
cp -r ../frontend/dist/* src/main/resources/static/
```

### 2.3 Backend 빌드
```bash
# Gradle 사용시
./gradlew clean build -x test

# Maven 사용시
./mvnw clean package -DskipTests
```

### 2.4 환경별 설정 파일 준비
```bash
# application-prod.yml 생성
vi src/main/resources/application-prod.yml
```

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-rds-endpoint:3306/mes_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

server:
  port: 8080

logging:
  level:
    root: INFO
```

## 3. 서비스 실행

### 3.1 직접 실행
```bash
java -jar -Dspring.profiles.active=prod \
  -DDB_USERNAME=your_username \
  -DDB_PASSWORD=your_password \
  build/libs/smart-factory-mes-*.jar
```

### 3.2 백그라운드 실행 (nohup)
```bash
nohup java -jar -Dspring.profiles.active=prod \
  -DDB_USERNAME=your_username \
  -DDB_PASSWORD=your_password \
  build/libs/smart-factory-mes-*.jar > app.log 2>&1 &
```

### 3.3 systemd 서비스 등록 (권장)
```bash
sudo vi /etc/systemd/system/mes.service
```

```ini
[Unit]
Description=Smart Factory MES
After=syslog.target

[Service]
User=ec2-user
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /home/ec2-user/smart-factory-mes/backend/build/libs/smart-factory-mes-*.jar
SuccessExitStatus=143
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 시작
sudo systemctl daemon-reload
sudo systemctl enable mes
sudo systemctl start mes
sudo systemctl status mes
```

## 4. Nginx 리버스 프록시 설정 (선택사항)

### 4.1 Nginx 설치
```bash
sudo yum install nginx -y
```

### 4.2 Nginx 설정
```bash
sudo vi /etc/nginx/conf.d/mes.conf
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo systemctl restart nginx
```

## 5. 배포 자동화 스크립트

### 5.1 배포 스크립트 생성
```bash
vi deploy.sh
```

```bash
#!/bin/bash

echo "========================================="
echo "Smart Factory MES 배포 시작"
echo "========================================="

# Git 최신 코드 pull
git pull origin main

# Frontend 빌드
cd frontend
npm install
npm run build

# Backend static 리소스 복사
cd ../backend
rm -rf src/main/resources/static/*
cp -r ../frontend/dist/* src/main/resources/static/

# Backend 빌드
./gradlew clean build -x test

# 기존 서비스 중지
sudo systemctl stop mes

# JAR 파일 복사
cp build/libs/smart-factory-mes-*.jar /home/ec2-user/mes-app.jar

# 서비스 재시작
sudo systemctl start mes

echo "========================================="
echo "배포 완료!"
echo "========================================="
```

```bash
chmod +x deploy.sh
```

## 6. 모니터링 및 로그

### 6.1 애플리케이션 로그 확인
```bash
# systemd 로그
sudo journalctl -u mes -f

# 직접 실행시 로그
tail -f app.log
```

### 6.2 헬스 체크
```bash
curl http://localhost:8080/actuator/health
```

## 7. 트러블슈팅

### 메모리 부족 문제
```bash
# JVM 메모리 설정
java -Xms512m -Xmx1024m -jar your-app.jar
```

### 포트 충돌
```bash
# 포트 사용 확인
sudo lsof -i :8080
```

### 권한 문제
```bash
# 파일 권한 설정
chmod 755 your-app.jar
chown ec2-user:ec2-user your-app.jar
```

## 8. Docker 배포 (선택사항)

### 8.1 Docker 설치
```bash
sudo yum install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user
```

### 8.2 Docker Compose 실행
```bash
docker-compose up -d
```

## 보안 권장사항
- 환경 변수로 민감한 정보 관리
- HTTPS 인증서 적용 (Let's Encrypt)
- 정기적인 보안 업데이트
- 로그 모니터링 설정
- DB 접근 제한 (보안 그룹)