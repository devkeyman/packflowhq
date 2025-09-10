# EC2 빠른 시작 가이드

## 🚀 10분 안에 EC2에 배포하기

### 1️⃣ EC2 인스턴스 접속
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### 2️⃣ 초기 설정 스크립트 다운로드 및 실행
```bash
# 스크립트 다운로드
wget https://raw.githubusercontent.com/your-repo/smart-factory-mes/main/backend/scripts/setup-ec2.sh

# 실행 권한 부여
chmod +x setup-ec2.sh

# 스크립트 실행
./setup-ec2.sh
```

### 3️⃣ 애플리케이션 빌드
```bash
cd /opt/mes/smart-factory-mes/backend
./mvnw clean package -DskipTests
```

### 4️⃣ 서비스 시작
```bash
sudo systemctl start mes
sudo systemctl enable mes
```

### 5️⃣ 상태 확인
```bash
# 서비스 상태
sudo systemctl status mes

# 로그 확인
sudo journalctl -u mes -f

# 헬스체크
curl http://localhost:8080/actuator/health
```

## ✅ 체크리스트

- [ ] EC2 인스턴스 생성 (t3.medium 권장)
- [ ] 보안 그룹 설정 (포트: 22, 80, 443, 8080)
- [ ] 탄력적 IP 할당
- [ ] 초기 설정 스크립트 실행
- [ ] 애플리케이션 빌드 및 실행
- [ ] 브라우저에서 접속 테스트

## 🔗 접속 URL
```
http://your-ec2-public-ip
```

## 📁 주요 파일 위치

| 구분 | 경로 |
|-----|------|
| 애플리케이션 | `/opt/mes/smart-factory-mes/backend` |
| 환경 변수 | `/etc/environment.mes` |
| 서비스 파일 | `/etc/systemd/system/mes.service` |
| Nginx 설정 | `/etc/nginx/conf.d/mes.conf` |
| 애플리케이션 로그 | `/var/log/mes/` |
| Nginx 로그 | `/var/log/nginx/` |

## 🛠️ 유용한 명령어

### 배포
```bash
cd /opt/mes/smart-factory-mes/backend
./scripts/deploy.sh
```

### 롤백
```bash
cd /opt/mes/smart-factory-mes/backend
./scripts/rollback.sh
```

### 서비스 관리
```bash
# 시작
sudo systemctl start mes

# 중지
sudo systemctl stop mes

# 재시작
sudo systemctl restart mes

# 상태
sudo systemctl status mes
```

### 로그 확인
```bash
# 실시간 로그
sudo journalctl -u mes -f

# 최근 100줄
sudo journalctl -u mes -n 100

# 특정 시간 이후
sudo journalctl -u mes --since "10 minutes ago"
```

## 🔐 기본 계정 정보

### MySQL
- Database: `mes_db_prod`
- Username: `mes_user`
- Password: (설치 시 설정한 비밀번호)

### 애플리케이션 (기본)
- Admin Email: `admin@mes.com`
- Admin Password: `admin123`
- **⚠️ 운영 환경에서는 반드시 변경하세요!**

## 🚨 문제 해결

### 포트 이미 사용 중
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

### 메모리 부족
```bash
# Swap 추가
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 데이터베이스 연결 실패
```bash
# MySQL 상태 확인
sudo systemctl status mysql

# 연결 테스트
mysql -u mes_user -p mes_db_prod
```

### Nginx 502 Bad Gateway
```bash
# 애플리케이션 실행 확인
curl http://localhost:8080/health

# Nginx 재시작
sudo systemctl restart nginx
```

## 📞 지원

문제가 지속되면 다음 로그를 확인하세요:
- 애플리케이션: `sudo journalctl -u mes -n 200`
- Nginx: `sudo tail -f /var/log/nginx/mes_error.log`
- MySQL: `sudo tail -f /var/log/mysql/error.log`