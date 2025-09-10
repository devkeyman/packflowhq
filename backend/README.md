# Smart Factory MES Backend

스마트 팩토리 제조실행시스템(MES) 백엔드 애플리케이션

## 🚀 기술 스택

- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT
- **Architecture**: Hexagonal Architecture (Ports & Adapters)
- **Build Tool**: Maven

## 📁 프로젝트 구조

```
backend/
├── src/main/java/com/mes/
│   ├── adapter/              # 어댑터 계층
│   │   ├── in/web/           # 인바운드 어댑터 (Controller)
│   │   └── out/persistence/  # 아웃바운드 어댑터 (Repository)
│   ├── application/          # 애플리케이션 계층
│   │   ├── port/             # 포트 정의
│   │   └── service/          # 비즈니스 로직
│   ├── domain/               # 도메인 계층
│   │   └── model/            # 도메인 모델
│   ├── common/               # 공통 컴포넌트
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── exception/        # 예외 처리
│   │   └── mapper/           # Entity-DTO 매핑
│   └── config/               # 설정 클래스
├── src/main/resources/
│   ├── application.yml       # 공통 설정
│   ├── application-dev.yml   # 개발 환경 설정
│   ├── application-stg.yml   # 스테이징 환경 설정
│   └── application-prod.yml  # 운영 환경 설정
└── reports/                  # 문서 및 가이드
    ├── API_SPECIFICATION.md  # API 명세서
    ├── PROFILE_GUIDE.md      # 프로파일 설정 가이드
    └── HELP.md              # 도움말

```

## 🏃‍♂️ 빠른 시작

### 필수 요구사항
- Java 17 이상
- Maven 3.6 이상
- MySQL 8.0 이상

### 데이터베이스 설정
```sql
CREATE DATABASE mes_db_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'inno0000';
GRANT ALL PRIVILEGES ON mes_db_dev.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

### 애플리케이션 실행

#### 개발 환경 (기본)
```bash
./mvnw spring-boot:run
```

#### 스테이징 환경
```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=stg
```

#### 운영 환경
```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=prod
```

## 📋 주요 기능

- **사용자 관리**: 로그인, 권한 관리 (ADMIN, MANAGER, WORKER)
- **작업 지시 관리**: 작업 생성, 할당, 진행률 추적
- **이슈 관리**: 문제 보고, 해결, 추적
- **작업 로그**: 모든 작업 활동 기록
- **대시보드**: 실시간 통계 및 현황

## 🔐 보안

- JWT 기반 인증
- Role 기반 권한 관리
- CORS 설정
- SQL Injection 방지 (JPA 사용)

## 📚 추가 문서

- [API 명세서](reports/API_SPECIFICATION.md)
- [프로파일 설정 가이드](reports/PROFILE_GUIDE.md)
- [도움말](reports/HELP.md)

## 🧪 테스트

```bash
# 전체 테스트 실행
./mvnw test

# 특정 테스트 클래스 실행
./mvnw test -Dtest=WorkOrderServiceTest
```

## 📦 빌드 및 배포

```bash
# JAR 파일 빌드
./mvnw clean package

# JAR 파일 실행
java -jar target/mes-inno-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## 🤝 기여 방법

1. 이 저장소를 Fork 합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.