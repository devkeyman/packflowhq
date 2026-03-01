# API Interface Documentation

## 개요
이 문서는 MES PackFlow 시스템의 Frontend와 Backend 간 API 인터페이스를 정의합니다.

- **Base URL**: `http://localhost:8080/api`
- **인증 방식**: JWT Bearer Token
- **Content-Type**: `application/json`

## 인증 (Authentication)

### 1. 로그인
**POST** `/auth/login`

#### Request
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "ADMIN | MANAGER | WORKER"
  }
}
```

### 2. 토큰 갱신
**POST** `/auth/refresh`

#### Request
```json
{
  "refreshToken": "string"
}
```

#### Response
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": { ... }
}
```

### 3. 로그아웃
**POST** `/auth/logout`

#### Request
```json
{
  "email": "string"
}
```

#### Response
```json
{
  "message": "Logout successful"
}
```

## 작업 지시서 (Work Orders)

### 1. 작업 지시서 생성
**POST** `/work-orders`
- **권한**: ADMIN, MANAGER

#### Request
```json
{
  "orderNumber": "string",
  "productName": "string",
  "productCode": "string",
  "quantity": "number",
  "dueDate": "LocalDateTime",
  "priority": "LOW | NORMAL | MEDIUM | HIGH | URGENT",
  "instructions": "string",
  "assignedToId": "number"
}
```

#### Response
```json
{
  "id": "number",
  "orderNumber": "string",
  "productName": "string",
  "productCode": "string",
  "quantity": "number",
  "actualQuantity": "number | null",
  "status": "PENDING | IN_PROGRESS | COMPLETED | CANCELLED",
  "priority": "LOW | NORMAL | MEDIUM | HIGH | URGENT",
  "progress": "number",
  "dueDate": "LocalDateTime",
  "startedAt": "LocalDateTime | null",
  "completedAt": "LocalDateTime | null",
  "instructions": "string",
  "notes": "string | null",
  "assignedTo": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### 2. 작업 지시서 목록 조회
**GET** `/work-orders`
- **권한**: 모든 사용자 (WORKER는 자신에게 할당된 것만)

#### Query Parameters
- `status`: WorkStatus (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority`: Priority (LOW, NORMAL, MEDIUM, HIGH, URGENT)
- `assignedTo`: number (사용자 ID)

#### Response
```json
[
  {
    "id": "number",
    "orderNumber": "string",
    "productName": "string",
    "quantity": "number",
    "status": "string",
    "priority": "string",
    "progress": "number",
    "dueDate": "LocalDateTime",
    "assignedTo": { ... },
    ...
  }
]
```

### 3. 작업 지시서 상세 조회
**GET** `/work-orders/{id}`
- **권한**: 모든 사용자 (WORKER는 자신에게 할당된 것만)

#### Response
```json
{
  "id": "number",
  "orderNumber": "string",
  "productName": "string",
  "productCode": "string",
  "quantity": "number",
  "actualQuantity": "number | null",
  "status": "string",
  "priority": "string",
  "progress": "number",
  "dueDate": "LocalDateTime",
  "startedAt": "LocalDateTime | null",
  "completedAt": "LocalDateTime | null",
  "instructions": "string",
  "notes": "string | null",
  "assignedTo": { ... },
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### 4. 작업 지시서 수정
**PUT** `/work-orders/{id}`
- **권한**: ADMIN, MANAGER

#### Request
```json
{
  "productName": "string",
  "productCode": "string",
  "quantity": "number",
  "dueDate": "LocalDateTime",
  "priority": "string",
  "instructions": "string",
  "assignedToId": "number",
  "status": "string"
}
```

### 5. 작업 지시서 삭제
**DELETE** `/work-orders/{id}`
- **권한**: ADMIN

### 6. 작업 시작
**PUT** `/work-orders/{id}/start`
- **권한**: 할당된 작업자, ADMIN, MANAGER

#### Response
```json
{
  "message": "Work started successfully"
}
```

### 7. 작업 완료
**PUT** `/work-orders/{id}/complete`
- **권한**: 할당된 작업자, ADMIN, MANAGER

#### Request
```json
{
  "actualQuantity": "number",
  "notes": "string"
}
```

#### Response
```json
{
  "message": "Work completed successfully"
}
```

### 8. 진행률 업데이트
**PUT** `/work-orders/{id}/progress`
- **권한**: 할당된 작업자, ADMIN, MANAGER

#### Request
```json
{
  "progress": "number"
}
```

#### Response
```json
{
  "message": "Progress updated successfully"
}
```

## 이슈 관리 (Issues)

### 1. 이슈 생성
**POST** `/issues`
- **권한**: 모든 사용자

#### Request
```json
{
  "workOrderId": "number",
  "title": "string",
  "description": "string",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "type": "EQUIPMENT | QUALITY | SAFETY | PROCESS | OTHER"
}
```

#### Response
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "OPEN | IN_PROGRESS | RESOLVED | CLOSED",
  "priority": "string",
  "type": "string",
  "workOrder": {
    "id": "number",
    "orderNumber": "string"
  },
  "reporter": {
    "id": "number",
    "name": "string",
    "email": "string"
  },
  "resolution": "string | null",
  "createdAt": "LocalDateTime",
  "resolvedAt": "LocalDateTime | null"
}
```

### 2. 이슈 목록 조회
**GET** `/issues`

#### Query Parameters
- `status`: IssueStatus (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `priority`: Priority (LOW, MEDIUM, HIGH, CRITICAL)
- `type`: IssueType (EQUIPMENT, QUALITY, SAFETY, PROCESS, OTHER)
- `reportedBy`: number (사용자 ID)

#### Response
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "type": "string",
    "workOrder": { ... },
    "reporter": { ... },
    "createdAt": "LocalDateTime",
    ...
  }
]
```

### 3. 이슈 상세 조회
**GET** `/issues/{id}`

### 4. 이슈 수정
**PUT** `/issues/{id}`
- **권한**: ADMIN, MANAGER, 작성자

#### Request
```json
{
  "title": "string",
  "description": "string",
  "priority": "string",
  "status": "string"
}
```

### 5. 이슈 삭제
**DELETE** `/issues/{id}`
- **권한**: ADMIN

### 6. 이슈 해결
**PUT** `/issues/{id}/resolve`
- **권한**: ADMIN, MANAGER

#### Request
```json
{
  "resolution": "string"
}
```

#### Response
```json
{
  "message": "Issue resolved successfully",
  "resolution": "string"
}
```

## 대시보드 (Dashboard)

### 1. 대시보드 통계
**GET** `/dashboard/stats`

#### Response
```json
{
  "totalWorkOrders": "number",
  "pendingWorkOrders": "number",
  "inProgressWorkOrders": "number",
  "completedWorkOrders": "number",
  "totalIssues": "number",
  "openIssues": "number",
  "resolvedIssues": "number",
  "todayWorkOrders": "number",
  "todayCompletedOrders": "number",
  "averageCompletionRate": "number",
  "onTimeDeliveryRate": "number"
}
```

### 2. 최근 작업 지시서
**GET** `/dashboard/recent-work-orders`

#### Query Parameters
- `limit`: number (기본값: 10)

#### Response
```json
[
  {
    "id": "number",
    "orderNumber": "string",
    "productName": "string",
    "quantity": "number",
    "status": "string",
    "priority": "string",
    "progress": "number",
    "dueDate": "LocalDateTime",
    "createdAt": "LocalDateTime"
  }
]
```

### 3. 최근 이슈
**GET** `/dashboard/recent-issues`

#### Query Parameters
- `limit`: number (기본값: 10)

#### Response
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "type": "string",
    "workOrderId": "number | null",
    "reportedBy": "string",
    "createdAt": "LocalDateTime"
  }
]
```

### 4. 최근 활동
**GET** `/dashboard/recent-activities`

#### Query Parameters
- `limit`: number (기본값: 20)

#### Response
```json
[
  {
    "id": "number",
    "type": "WORK_LOG | WORK_ORDER",
    "action": "string",
    "description": "string",
    "userId": "number | null",
    "userName": "string",
    "timestamp": "LocalDateTime"
  }
]
```

### 5. 생산 요약
**GET** `/dashboard/production-summary`

#### Query Parameters
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)

#### Response
```json
{
  "totalQuantityOrdered": "number",
  "totalQuantityProduced": "number",
  "productionRate": "number",
  "byProduct": [
    {
      "productName": "string",
      "ordered": "number",
      "produced": "number",
      "rate": "number"
    }
  ],
  "byDate": [
    {
      "date": "string",
      "ordered": "number",
      "produced": "number"
    }
  ]
}
```

## 사용자 관리 (Users)

### 1. 사용자 생성
**POST** `/users`
- **권한**: ADMIN

#### Request
```json
{
  "email": "string",
  "name": "string",
  "password": "string",
  "role": "ADMIN | MANAGER | WORKER"
}
```

#### Response
```json
{
  "id": "number",
  "email": "string",
  "name": "string",
  "role": "string",
  "isActive": "boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### 2. 사용자 목록 조회
**GET** `/users`
- **권한**: ADMIN, MANAGER

#### Response
```json
[
  {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": "boolean",
    "createdAt": "LocalDateTime",
    "updatedAt": "LocalDateTime"
  }
]
```

### 3. 사용자 상세 조회
**GET** `/users/{id}`
- **권한**: ADMIN, MANAGER, 본인

### 4. 사용자 정보 수정
**PUT** `/users/{id}`
- **권한**: ADMIN, 본인 (본인은 role 변경 불가)

#### Request
```json
{
  "name": "string",
  "role": "string | null",
  "isActive": "boolean",
  "password": "string | null"
}
```

### 5. 사용자 삭제
**DELETE** `/users/{id}`
- **권한**: ADMIN

### 6. 비밀번호 변경
**PUT** `/users/{id}/password`
- **권한**: ADMIN, 본인

#### Request
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

#### Response
```json
{
  "message": "Password changed successfully"
}
```

## 작업 로그 (Work Logs)

### 1. 작업 로그 생성
**POST** `/work-logs`

#### Request
```json
{
  "workOrderId": "number",
  "action": "STARTED | PAUSED | RESUMED | COMPLETED | UPDATED | COMMENTED",
  "notes": "string",
  "progress": "number"
}
```

#### Response
```json
{
  "id": "number",
  "workOrder": {
    "id": "number",
    "orderNumber": "string"
  },
  "user": {
    "id": "number",
    "name": "string"
  },
  "action": "string",
  "description": "string",
  "loggedAt": "LocalDateTime"
}
```

### 2. 작업 로그 목록 조회
**GET** `/work-logs`

#### Query Parameters
- `workOrderId`: number
- `userId`: number
- `action`: WorkAction
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)

#### Response
```json
[
  {
    "id": "number",
    "workOrder": { ... },
    "user": { ... },
    "action": "string",
    "description": "string",
    "loggedAt": "LocalDateTime"
  }
]
```

### 3. 작업 로그 상세 조회
**GET** `/work-logs/{id}`

### 4. 특정 작업 지시서의 로그 조회
**GET** `/work-logs/work-order/{workOrderId}`

#### Response
```json
[
  {
    "id": "number",
    "workOrder": { ... },
    "user": { ... },
    "action": "string",
    "description": "string",
    "loggedAt": "LocalDateTime"
  }
]
```

## 공통 에러 응답

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request data",
  "details": { ... }
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## HTTP 헤더

### 요청 헤더
- `Authorization`: Bearer {accessToken}
- `Content-Type`: application/json

### 응답 헤더
- `Content-Type`: application/json

## CORS 설정
허용된 Origin:
- `http://localhost:3000`
- `http://localhost:5173`

## 날짜/시간 형식
- 모든 날짜/시간은 ISO 8601 형식 사용
- 예: `2024-09-14T10:30:00`

## 페이지네이션
현재 구현되지 않음. 필요시 추가 구현 예정:
- `page`: 페이지 번호 (0부터 시작)
- `size`: 페이지 크기
- `sort`: 정렬 기준 (예: `createdAt,desc`)

## 참고사항
1. 모든 API는 JWT 토큰 기반 인증 필요 (로그인 제외)
2. 토큰 만료 시 401 응답과 함께 refresh token으로 갱신 필요
3. WORKER 권한 사용자는 자신에게 할당된 작업 지시서만 조회/수정 가능
4. 비밀번호는 모든 요청/응답에서 제외 (생성/수정 시 제외)
5. 실시간 업데이트가 필요한 경우 WebSocket 구현 예정
