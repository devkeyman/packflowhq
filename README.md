# PackFlow - Smart Factory MES

PackFlow 스마트 팩토리를 위한 제조 실행 시스템(MES) - 생산 관리 및 작업 지시 추적을 위한 웹 기반 플랫폼

## Quick Start

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

### 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| Admin | admin@mes.com | admin123 |
| Manager | manager@mes.com | manager123 |
| Worker | worker@mes.com | worker123 |

## 주요 기능

- **사용자 인증 및 권한 관리**: JWT 기반 인증, 역할별 접근 제어 (ADMIN / MANAGER / WORKER)
- **작업 지시서 관리**: 작업 생성, 할당, 상태 전이(대기/진행/일시정지/완료/취소), 진행률 추적
- **생산 모니터링 대시보드**: 상태별/우선순위별 통계, 마감 임박 알림

## 기술 스택

### Backend

- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Architecture**: Hexagonal Architecture (Port & Adapter)

### Frontend

- **Framework**: React 19 + TypeScript 5
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand + TanStack React Query
- **HTTP Client**: Axios
- **UI**: Tailwind CSS + shadcn/ui
- **Architecture**: Feature-Sliced Design (FSD)

## 프로젝트 구조

```
mes-inno/
├── backend/                    # Spring Boot 백엔드
│   └── src/main/java/com/mes/
│       ├── adapter/            # 어댑터 (Web Controller, Persistence)
│       ├── application/        # 유스케이스, 서비스
│       ├── domain/             # 도메인 모델
│       ├── config/             # 설정 클래스
│       └── common/             # DTO, 예외, 매퍼
│
├── frontend/                   # React 프론트엔드
│   └── src/
│       ├── app/                # 라우터, 레이아웃
│       ├── pages/              # 페이지 컴포넌트
│       ├── widgets/            # 복합 UI 블록
│       ├── features/           # 비즈니스 로직, 훅
│       ├── entities/           # 도메인 모델, 타입
│       └── shared/             # API 클라이언트, 공통 컴포넌트
│
├── docs/                       # 설계 문서
└── scripts/                    # 유틸리티 스크립트
```

## 로컬 개발 환경 설정

### 사전 요구사항

- Java 17+
- Node.js 18+
- MySQL 8.0+

### 데이터베이스 설정

```sql
CREATE DATABASE mes_db_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'inno0000';
GRANT ALL PRIVILEGES ON mes_db_dev.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

### Backend 실행

```bash
cd backend
./mvnw spring-boot:run
```

백엔드: http://localhost:8080

### Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드: http://localhost:5173

### 빌드

```bash
# Backend
cd backend && ./mvnw clean package -DskipTests

# Frontend
cd frontend && npm run build

# 전체 빌드 (Frontend -> Backend static)
./scripts/build.sh
```

## API 엔드포인트

Base URL: `http://localhost:8080/api`

| 엔드포인트 | 설명 |
|------------|------|
| `/api/auth/*` | 인증 (로그인, 토큰 갱신, 로그아웃) |
| `/api/users/*` | 사용자 관리 |
| `/api/work-orders/*` | 작업 지시서 CRUD 및 상태 관리 |
| `/api/dashboard/*` | 대시보드 통계 |

## 사용자 역할

| 역할 | 권한 |
|------|------|
| **ADMIN** | 시스템 전체 관리, 사용자 관리, 모든 데이터 접근 |
| **MANAGER** | 작업 지시서 관리, 보고서 조회 |
| **WORKER** | 할당된 작업 수행, 작업 상태 변경 |

## 배포

### 배포 아키텍처

- **프론트엔드**: Nginx 정적 파일 서빙
- **백엔드**: JAR 독립 실행 (Systemd 서비스)
- **도메인**:
  - `www.packflowhq.com` - 메인 서비스
  - `d.packflowhq.com` - 개발 환경

### EC2 배포 (Ubuntu)

```bash
# 전체 배포 (Backend + Frontend)
./deploy-all.sh

# 또는 개별 배포
./deploy-backend.sh
./deploy-frontend.sh
```

**Backend 배포 흐름** (`deploy-backend.sh`):

1. `./mvnw clean package -DskipTests` — JAR 빌드
2. `scp` — JAR를 EC2 `/tmp/`로 전송
3. `ssh` — 서비스 중지 → 기존 JAR 백업 → 새 JAR 이동 → 서비스 시작
4. 헬스체크 (`/api/actuator/health`)

**Frontend 배포 흐름** (`deploy-frontend.sh`):

1. `npm run build` — 정적 파일 빌드
2. `rsync` — `dist/`를 EC2 `/var/www/mes/frontend/`로 동기화
3. `ssh` — 권한 설정 → Nginx reload

**서버 정보**:

| 항목 | 값 |
|------|-----|
| 호스트 | `ubuntu@13.209.192.235` |
| PEM | `innopackage-smart-factory-mes.pem` (프로젝트 루트) |
| Backend 경로 | `/opt/mes/` |
| Frontend 경로 | `/var/www/mes/frontend/` |

### 서버 구성

| 항목 | 값 |
|------|-----|
| 인스턴스 | t3.small (Ubuntu 22.04) |
| Java | OpenJDK 17 |
| DB | MySQL 8.0 |
| 리버스 프록시 | Nginx |
| SSL | Let's Encrypt (Certbot) |

### 서비스 관리

```bash
# 서비스 상태 확인
sudo systemctl status mes
sudo systemctl status nginx

# 로그 확인
sudo journalctl -u mes -f

# 재시작
sudo systemctl restart mes
sudo systemctl restart nginx
```

## 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```
