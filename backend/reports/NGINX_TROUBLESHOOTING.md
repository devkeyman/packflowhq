# Nginx 트러블슈팅 가이드

## 🔴 오류: Job for nginx.service failed

### 1. 즉시 확인 사항

#### 상태 및 로그 확인
```bash
# 상세 상태 확인
sudo systemctl status nginx.service

# 상세 로그 확인
sudo journalctl -xeu nginx.service

# 최근 50줄 로그
sudo journalctl -u nginx -n 50

# Nginx 에러 로그
sudo tail -f /var/log/nginx/error.log
```

### 2. 주요 원인 및 해결 방법

#### 🔍 원인 1: 포트 80이 이미 사용 중
가장 흔한 원인입니다. Apache나 다른 웹서버가 이미 실행 중일 수 있습니다.

**확인:**
```bash
# 80 포트 사용 프로세스 확인
sudo lsof -i :80
# 또는
sudo netstat -tlnp | grep :80
```

**해결:**
```bash
# Apache가 실행 중인 경우
sudo systemctl stop httpd     # Amazon Linux
sudo systemctl stop apache2   # Ubuntu
sudo systemctl disable httpd
sudo systemctl disable apache2

# 또는 다른 프로세스가 사용 중인 경우
sudo kill -9 <PID>

# Nginx 재시작
sudo systemctl start nginx
```

#### 🔍 원인 2: Nginx 설정 파일 문법 오류
**확인:**
```bash
# 설정 파일 문법 검사
sudo nginx -t
```

**해결:**
```bash
# 기본 설정으로 복구
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
sudo cp /etc/nginx/nginx.conf.default /etc/nginx/nginx.conf

# 또는 문제있는 설정 파일 제거
sudo rm /etc/nginx/conf.d/*.conf
sudo rm /etc/nginx/sites-enabled/*

# Nginx 재시작
sudo systemctl restart nginx
```

#### 🔍 원인 3: SELinux 권한 문제 (Amazon Linux/RHEL)
**확인:**
```bash
# SELinux 상태 확인
getenforce

# SELinux 로그 확인
sudo grep nginx /var/log/audit/audit.log
```

**해결:**
```bash
# 임시 비활성화 (테스트용)
sudo setenforce 0

# Nginx 재시작
sudo systemctl restart nginx

# 영구 해결 (SELinux 정책 수정)
sudo setsebool -P httpd_can_network_connect 1
sudo semanage port -a -t http_port_t -p tcp 8080

# SELinux 다시 활성화
sudo setenforce 1
```

#### 🔍 원인 4: 권한 문제
**확인:**
```bash
# Nginx 사용자 확인
ps aux | grep nginx

# 디렉토리 권한 확인
ls -la /var/log/nginx/
ls -la /var/cache/nginx/
ls -la /var/run/
```

**해결:**
```bash
# 필요한 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/log/nginx
sudo mkdir -p /var/cache/nginx
sudo mkdir -p /var/run

# 권한 설정
sudo chown -R nginx:nginx /var/log/nginx
sudo chown -R nginx:nginx /var/cache/nginx
sudo chmod 755 /var/log/nginx
sudo chmod 755 /var/cache/nginx

# PID 파일 권한
sudo touch /var/run/nginx.pid
sudo chown nginx:nginx /var/run/nginx.pid
```

#### 🔍 원인 5: 패키지 충돌 또는 불완전한 설치
**해결:**
```bash
# Amazon Linux 2023
sudo dnf remove nginx -y
sudo dnf clean all
sudo dnf install nginx -y

# Ubuntu
sudo apt remove --purge nginx nginx-common -y
sudo apt autoremove -y
sudo apt update
sudo apt install nginx -y
```

### 3. 완전 초기화 방법

모든 방법이 실패한 경우:

```bash
#!/bin/bash

echo "Nginx 완전 초기화 시작..."

# 1. Nginx 중지
sudo systemctl stop nginx

# 2. Nginx 완전 제거
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [ "$ID" == "amzn" ]; then
        sudo dnf remove nginx -y
        sudo dnf clean all
    elif [ "$ID" == "ubuntu" ]; then
        sudo apt remove --purge nginx nginx-common -y
        sudo apt autoremove -y
    fi
fi

# 3. 설정 파일 백업 및 제거
sudo mv /etc/nginx /etc/nginx.backup.$(date +%Y%m%d)
sudo rm -rf /var/log/nginx
sudo rm -rf /var/cache/nginx
sudo rm -rf /usr/share/nginx
sudo rm -f /var/run/nginx.pid

# 4. Nginx 재설치
if [ "$ID" == "amzn" ]; then
    sudo dnf install nginx -y
elif [ "$ID" == "ubuntu" ]; then
    sudo apt update
    sudo apt install nginx -y
fi

# 5. 기본 설정 생성
sudo tee /etc/nginx/conf.d/default.conf > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# 6. Nginx 시작
sudo systemctl start nginx
sudo systemctl enable nginx

echo "Nginx 초기화 완료!"
sudo systemctl status nginx
```

### 4. 대안: Docker로 Nginx 실행

시스템 Nginx가 문제가 있는 경우:

```bash
# Docker 설치 (아직 없는 경우)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Nginx 컨테이너 실행
sudo docker run -d \
  --name nginx \
  -p 80:80 \
  -p 443:443 \
  -v /opt/mes/nginx.conf:/etc/nginx/conf.d/default.conf \
  --restart always \
  nginx:latest
```

### 5. MES 애플리케이션용 임시 해결책

Nginx 없이 직접 8080 포트 사용:

```bash
# 보안 그룹에서 8080 포트 열기
# AWS Console > EC2 > Security Groups > Inbound rules > Edit
# Add rule: Custom TCP, Port 8080, Source 0.0.0.0/0

# 애플리케이션 직접 접속
http://your-ec2-ip:8080
```

### 6. 디버깅 명령어 모음

```bash
# 시스템 정보
uname -a
cat /etc/os-release

# 네트워크 상태
sudo netstat -tlnp
sudo ss -tlnp

# 프로세스 확인
ps aux | grep -E '(nginx|httpd|apache)'

# 방화벽 확인
sudo iptables -L -n
sudo firewall-cmd --list-all  # RHEL/CentOS

# 디스크 공간 확인
df -h

# 메모리 확인
free -m

# Nginx 바이너리 위치
which nginx
nginx -V
```

### 7. 로그 위치

| 로그 유형 | 경로 |
|---------|------|
| Nginx 에러 로그 | `/var/log/nginx/error.log` |
| Nginx 액세스 로그 | `/var/log/nginx/access.log` |
| 시스템 로그 | `/var/log/messages` 또는 `/var/log/syslog` |
| SELinux 로그 | `/var/log/audit/audit.log` |

### 8. 자주 발생하는 에러 메시지

#### "Address already in use"
```bash
# 해결
sudo fuser -k 80/tcp
sudo systemctl restart nginx
```

#### "Permission denied"
```bash
# 해결
sudo chown -R nginx:nginx /etc/nginx
sudo chmod 755 /etc/nginx
```

#### "Failed to read PID from file"
```bash
# 해결
sudo mkdir -p /var/run
sudo touch /var/run/nginx.pid
sudo chown nginx:nginx /var/run/nginx.pid
```

### 9. 최종 점검 사항

```bash
#!/bin/bash

echo "=== Nginx 상태 점검 ==="

# 1. 서비스 상태
echo "1. 서비스 상태:"
sudo systemctl is-active nginx

# 2. 포트 리스닝
echo "2. 포트 80 상태:"
sudo lsof -i :80

# 3. 설정 문법
echo "3. 설정 파일 검증:"
sudo nginx -t

# 4. 프로세스
echo "4. Nginx 프로세스:"
ps aux | grep nginx

# 5. 로그 확인
echo "5. 최근 에러:"
sudo tail -5 /var/log/nginx/error.log

# 6. 테스트
echo "6. 로컬 연결 테스트:"
curl -I http://localhost
```

## 💡 추가 지원

문제가 지속되면:
1. EC2 인스턴스 타입 확인 (t2.micro는 메모리 부족 가능)
2. 보안 그룹 규칙 재확인
3. VPC 네트워크 ACL 확인
4. CloudWatch 로그 확인