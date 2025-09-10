# Spring Boot 프로파일 설정 가이드

## 📁 프로파일 구조

```
src/main/resources/
├── application.yml          # 공통 설정 (모든 환경에서 공유)
├── application-dev.yml      # 개발 환경 설정
├── application-stg.yml      # 스테이징 환경 설정
└── application-prod.yml     # 운영 환경 설정
```

## 🚀 프로파일 활성화 방법

### 1. application.yml에서 기본 프로파일 설정
```yaml
spring:
  profiles:
    active: dev  # 기본값 설정
```

### 2. 실행 시 명령줄 인자로 지정

#### Maven 실행
```bash
# 개발 환경
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=dev

# 스테이징 환경
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=stg

# 운영 환경
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=prod
```

#### JAR 파일 실행
```bash
# 개발 환경
java -jar target/mes-inno-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# 스테이징 환경
java -jar target/mes-inno-0.0.1-SNAPSHOT.jar --spring.profiles.active=stg

# 운영 환경
java -jar target/mes-inno-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### 3. 환경 변수로 설정
```bash
# Linux/Mac
export SPRING_PROFILES_ACTIVE=prod
java -jar target/mes-inno-0.0.1-SNAPSHOT.jar

# Windows
set SPRING_PROFILES_ACTIVE=prod
java -jar target/mes-inno-0.0.1-SNAPSHOT.jar
```

### 4. JVM 시스템 프로퍼티로 설정
```bash
java -Dspring.profiles.active=prod -jar target/mes-inno-0.0.1-SNAPSHOT.jar
```

### 5. IDE에서 설정

#### IntelliJ IDEA
1. Run/Debug Configurations 열기
2. Spring Boot 실행 구성 선택
3. Active profiles 필드에 원하는 프로파일 입력 (예: dev, stg, prod)
4. 또는 Environment variables에 `SPRING_PROFILES_ACTIVE=dev` 추가

#### Eclipse/STS
1. Run Configurations 열기
2. Spring Boot App 선택
3. Arguments 탭에서 Program arguments에 `--spring.profiles.active=dev` 추가
4. 또는 Environment 탭에서 `SPRING_PROFILES_ACTIVE=dev` 추가

## 🔐 환경별 필수 환경 변수

### 개발 환경 (dev)
- 모든 설정이 기본값으로 제공됨
- 추가 환경 변수 설정 불필요

### 스테이징 환경 (stg)
```bash
export DB_USERNAME=stg_user
export DB_PASSWORD=stg_password
export JWT_SECRET=your-staging-secret-key
```

### 운영 환경 (prod)
```bash
# 필수 환경 변수
export DB_URL=jdbc:mysql://prod-server:3306/mes_db_prod
export DB_USERNAME=prod_user
export DB_PASSWORD=prod_password
export JWT_SECRET=your-production-secret-key

# 선택적 환경 변수
export SERVER_PORT=8080
export JWT_EXPIRATION=86400000
export JWT_REFRESH_EXPIRATION=604800000
export LOG_PATH=/var/log/mes
```

## 📊 프로파일별 주요 차이점

| 설정 항목 | 개발(dev) | 스테이징(stg) | 운영(prod) |
|---------|----------|-------------|-----------|
| 데이터베이스 | localhost | stg-db-server | prod-db-server |
| DDL 자동 실행 | update | validate | none |
| SQL 로깅 | 활성화 | 비활성화 | 비활성화 |
| 로그 레벨 | DEBUG | INFO | WARN/ERROR |
| JWT 만료 시간 | 1시간 | 12시간 | 24시간 |
| CORS | 모든 출처 허용 | 특정 도메인만 | 운영 도메인만 |
| API 문서 | 활성화 | 활성화 | 비활성화 |
| DevTools | 활성화 | 비활성화 | 비활성화 |
| 액추에이터 | 모든 엔드포인트 | 일부 엔드포인트 | 최소 엔드포인트 |

## 🔍 현재 활성 프로파일 확인

### 1. 애플리케이션 시작 로그 확인
```
The following profiles are active: dev
```

### 2. Actuator 엔드포인트 활용
```bash
curl http://localhost:8080/actuator/env | grep "activeProfiles"
```

### 3. 애플리케이션 내부에서 확인
```java
@Component
public class ProfileChecker {
    @Autowired
    private Environment env;
    
    public void printActiveProfiles() {
        String[] profiles = env.getActiveProfiles();
        System.out.println("Active profiles: " + Arrays.toString(profiles));
    }
}
```

## 💡 베스트 프랙티스

1. **민감한 정보는 환경 변수로 관리**
   - 데이터베이스 비밀번호, JWT Secret 등은 코드에 하드코딩하지 않음

2. **프로파일별 설정 파일 분리**
   - 공통 설정은 `application.yml`에
   - 환경별 설정은 각 프로파일 파일에

3. **운영 환경 보안 강화**
   - 운영 환경에서는 디버그 정보 노출 최소화
   - SSL 사용, 보안 헤더 추가

4. **로컬 개발 시 dev 프로파일 사용**
   - 개발 편의성을 위한 설정 활성화
   - 상세한 로깅으로 디버깅 용이

5. **CI/CD 파이프라인에서 프로파일 자동 설정**
   - 배포 환경에 따라 자동으로 프로파일 선택

## 🛠️ 트러블슈팅

### 프로파일이 적용되지 않는 경우
1. 오타 확인 (dev, stg, prod)
2. 설정 파일 위치 확인 (src/main/resources)
3. 우선순위 확인 (명령줄 인자 > 환경 변수 > 설정 파일)

### 설정값이 덮어씌워지지 않는 경우
1. YAML 문법 오류 확인
2. 프로파일 파일명 확인 (application-{profile}.yml)
3. 프로파일 활성화 여부 확인

### 환경 변수가 인식되지 않는 경우
1. 환경 변수 이름 확인 (대소문자 구분)
2. ${변수명:기본값} 형식 사용
3. 시스템 재시작 또는 IDE 재시작