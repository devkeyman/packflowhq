# MES Backend 개발 가이드

## 아키텍처: 헥사고날 (Port & Adapter)

```
[Client] → Controller → UseCase(Port In) → Service → Domain
                ↓                                        ↓
          Request/Response                         Port Out
                                                       ↓
                                            PersistenceAdapter → Entity → [DB]
```

### 디렉토리 구조

```
src/main/java/com/mes/
├── adapter/
│   ├── in/web/
│   │   ├── controller/          # REST Controller
│   │   └── dto/
│   │       └── {entity}/
│   │           ├── request/     # 요청 DTO (Validation)
│   │           └── response/    # 응답 DTO
│   └── out/persistence/
│       ├── entity/              # JPA Entity
│       ├── repository/          # Spring Data JPA Repository
│       └── {Entity}PersistenceAdapter.java
├── application/
│   ├── port/
│   │   ├── in/                  # UseCase Interface (Input Port)
│   │   └── out/                 # Repository Interface (Output Port)
│   └── service/                 # UseCase 구현체
├── domain/
│   ├── model/                   # Domain Model (순수 Java)
│   └── service/                 # Domain Service
├── config/                      # Spring Configuration
└── common/
    ├── dto/                     # 공통 DTO
    ├── exception/               # 예외 클래스
    └── mapper/                  # 객체 변환 Mapper
```

---

## 계층별 책임

| 계층 | 책임 | 변경 사유 |
|------|------|----------|
| **Controller** | HTTP 요청/응답 처리 | API 스펙 변경 |
| **Request DTO** | 입력 데이터 + Validation | 클라이언트 요구사항 변경 |
| **Response DTO** | 출력 데이터 구성 | 클라이언트 요구사항 변경 |
| **UseCase (Port In)** | 비즈니스 유스케이스 정의 | 기능 추가/변경 |
| **Service** | 비즈니스 로직 구현 | 비즈니스 규칙 변경 |
| **Domain Model** | 핵심 비즈니스 규칙 | 도메인 규칙 변경 |
| **Port Out** | 외부 시스템 인터페이스 | 외부 연동 변경 |
| **Entity** | DB 스키마 매핑 | 테이블 구조 변경 |

---

## 네이밍 컨벤션

### DTO

| 구분 | 패턴 | 예시 |
|------|------|------|
| 등록 요청 | `Create{Entity}Request` | `CreateWorkOrderRequest` |
| 수정 요청 | `Update{Entity}Request` | `UpdateWorkOrderRequest` |
| 등록 응답 | `Create{Entity}Response` | `CreateWorkOrderResponse` |
| 상세 응답 | `{Entity}DetailResponse` | `WorkOrderDetailResponse` |
| 목록 응답 | `{Entity}ListResponse` | `WorkOrderListResponse` |

### UseCase

| 구분 | 패턴 | 예시 |
|------|------|------|
| Interface | `{Entity}UseCase` | `WorkOrderUseCase` |
| Command | `{Action}{Entity}Command` | `CreateWorkOrderCommand` |
| 메서드 | `{action}{Entity}` | `createWorkOrder()` |

### Controller

| 구분 | 패턴 | 예시 |
|------|------|------|
| Class | `{Entity}Controller` | `WorkOrderController` |
| 등록 메서드 | `create{Entity}` | `createWorkOrder()` |
| 조회 메서드 | `get{Entity}` / `get{Entity}List` | `getWorkOrder()` |
| 수정 메서드 | `update{Entity}` | `updateWorkOrder()` |
| 삭제 메서드 | `delete{Entity}` | `deleteWorkOrder()` |

---

## 단일 책임 원칙 (SRP)

### API별 DTO 분리

```
dto/workorder/
├── request/
│   ├── CreateWorkOrderRequest.java   # 등록 전용
│   └── UpdateWorkOrderRequest.java   # 수정 전용
└── response/
    ├── CreateWorkOrderResponse.java  # 등록 응답 전용
    ├── WorkOrderDetailResponse.java  # 상세 응답 전용
    └── WorkOrderListResponse.java    # 목록 응답 전용
```

**원칙**: 하나의 DTO는 하나의 API만 담당

---

## Validation 규칙

### 계층별 검증 책임

| 계층 | 검증 내용 | 예시 |
|------|----------|------|
| **Request DTO** | 입력값 형식 검증 | `@NotNull`, `@NotBlank`, `@Min`, `@FutureOrPresent` |
| **Service** | 비즈니스 규칙 검증 | 중복 체크, 권한 확인, 상태 전이 가능 여부 |
| **Domain Model** | 도메인 불변식 | 상태 변경 규칙 (`startWork()`, `completeWork()`) |

### Validation 메시지 (한글)

```java
@NotNull(message = "발주번호는 필수입니다")
@NotBlank(message = "업체명은 필수입니다")
@Min(value = 1, message = "수량은 1 이상이어야 합니다")
```

---

## 트랜잭션 관리

```java
@Service
@Transactional  // 클래스 레벨 기본 적용
public class WorkOrderService {

    @Transactional(readOnly = true)  // 조회는 읽기 전용
    public WorkOrder findById(Long id) { ... }

    // CUD 작업은 기본 @Transactional 사용
    public WorkOrder create(Command command) { ... }
}
```

---

## API 응답 표준

### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2024-12-04T12:00:00"
}
```

### 실패 응답

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "WORK_ORDER_NOT_FOUND",
    "message": "작업지시서를 찾을 수 없습니다"
  },
  "timestamp": "2024-12-04T12:00:00"
}
```

---

## 예외 처리

### 예외 계층 구조

```
BusinessException (추상 클래스)
├── EntityNotFoundException      # 엔티티 없음 (404)
├── DuplicateException          # 중복 데이터 (409)
├── InvalidStateException       # 잘못된 상태 전이 (400)
└── UnauthorizedException       # 권한 없음 (403)

ValidationException             # 입력값 오류 (400)
SystemException                 # 시스템 오류 (500)
```

### GlobalExceptionHandler

- 모든 예외를 일관된 형식으로 변환
- 적절한 HTTP 상태 코드 반환
- 에러 로깅

---

## 개발 순서 (신규 API)

1. **Domain Model** 설계/수정
2. **Entity** 작성 (DB 매핑)
3. **Port Out** 인터페이스 정의
4. **Repository** 구현
5. **UseCase (Port In)** 인터페이스 정의
6. **Service** 구현
7. **Request/Response DTO** 작성
8. **Controller** 구현
9. **테스트** 작성

---

## 테스트 전략

| 종류 | 대상 | 도구 |
|------|------|------|
| 단위 테스트 | Service, Domain | JUnit 5, Mockito |
| 통합 테스트 | Repository | @DataJpaTest |
| API 테스트 | Controller | @WebMvcTest, MockMvc |
| E2E 테스트 | 전체 흐름 | @SpringBootTest |
