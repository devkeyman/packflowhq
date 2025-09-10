# Smart Factory MES Backend API Specification

## Base Information
- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

## Authentication Flow
1. Login with email/password to get JWT token
2. Include token in Authorization header: `Bearer {token}`
3. Token expires in 24 hours, refresh token expires in 7 days

## User Roles
- **ADMIN**: Full system access
- **MANAGER**: Can manage work orders and view all data
- **WORKER**: Can update assigned work and report issues

---

## 1. Authentication Endpoints

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "admin@mes.com",
  "password": "admin123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "admin@mes.com",
  "name": "관리자",
  "role": "ADMIN"
}
```

Error Response (401):
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2025-08-10T12:52:53.623794",
  "errors": null
}
```

### Refresh Token
**POST** `/api/auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

Response: Same as login response

### Logout
**POST** `/api/auth/logout`

Request:
```json
{
  "email": "admin@mes.com"
}
```

Response (200):
```json
{
  "message": "Logout successful"
}
```

---

## 2. User Management

### Get All Users
**GET** `/api/users`
- **Required Role**: ADMIN

Response (200):
```json
[
  {
    "id": 1,
    "email": "admin@mes.com",
    "name": "관리자",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-08-10T12:40:59.957611",
    "updatedAt": "2025-08-10T12:40:59.957616"
  }
]
```

### Get User by ID
**GET** `/api/users/{id}`
- **Required Role**: ADMIN, MANAGER

Response (200):
```json
{
  "id": 1,
  "email": "admin@mes.com",
  "name": "관리자",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2025-08-10T12:40:59.957611",
  "updatedAt": "2025-08-10T12:40:59.957616"
}
```

### Create User
**POST** `/api/users`
- **Required Role**: ADMIN

Request:
```json
{
  "email": "newuser@mes.com",
  "name": "새 사용자",
  "password": "password123",
  "role": "WORKER"
}
```

Response (201): Created user object

### Update User
**PUT** `/api/users/{id}`
- **Required Role**: ADMIN

Request:
```json
{
  "name": "수정된 이름",
  "role": "MANAGER",
  "isActive": true
}
```

Response (200): Updated user object

### Delete User
**DELETE** `/api/users/{id}`
- **Required Role**: ADMIN

Response (204): No content

### Change Password
**PUT** `/api/users/{id}/password`
- **Required Role**: User can change own password, ADMIN can change any

Request:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

Response (200):
```json
{
  "message": "Password changed successfully"
}
```

---

## 3. Work Order Management

### Get All Work Orders
**GET** `/api/work-orders`
- **Optional Query Parameters**:
  - `status`: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  - `priority`: LOW, MEDIUM, HIGH, URGENT
  - `assignedTo`: User ID

Response (200):
```json
[
  {
    "id": 1,
    "orderNumber": "WO-2025-001",
    "productName": "테스트 제품",
    "productCode": "PROD-001",
    "quantity": 100,
    "dueDate": "2025-08-15T10:00:00",
    "priority": "HIGH",
    "status": "PENDING",
    "instructions": "특별 지시사항",
    "progress": 0,
    "assignedToId": 3,
    "assignedToName": "작업자",
    "startedAt": null,
    "completedAt": null,
    "createdAt": "2025-08-10T12:52:38.209933",
    "updatedAt": "2025-08-10T12:52:38.209936"
  }
]
```

### Get Work Order by ID
**GET** `/api/work-orders/{id}`

Response (200): Single work order object

### Create Work Order
**POST** `/api/work-orders`
- **Required Role**: ADMIN, MANAGER

Request:
```json
{
  "orderNumber": "WO-2025-002",
  "productName": "제품명",
  "productCode": "PROD-002",
  "quantity": 50,
  "dueDate": "2025-08-20T15:00:00",
  "priority": "MEDIUM",
  "instructions": "작업 지시사항",
  "assignedToId": 3
}
```

Response (201): Created work order object

### Update Work Order
**PUT** `/api/work-orders/{id}`
- **Required Role**: ADMIN, MANAGER

Request:
```json
{
  "quantity": 150,
  "priority": "URGENT",
  "status": "IN_PROGRESS",
  "progress": 50,
  "assignedToId": 4
}
```

Response (200): Updated work order object

### Delete Work Order
**DELETE** `/api/work-orders/{id}`
- **Required Role**: ADMIN

Response (204): No content

### Start Work
**PUT** `/api/work-orders/{id}/start`
- **Required Role**: Assigned worker or MANAGER

Response (200): Updated work order with status "IN_PROGRESS"

### Complete Work
**PUT** `/api/work-orders/{id}/complete`
- **Required Role**: Assigned worker or MANAGER

Request:
```json
{
  "actualQuantity": 98,
  "notes": "완료 메모"
}
```

Response (200): Updated work order with status "COMPLETED"

### Update Progress
**PUT** `/api/work-orders/{id}/progress`
- **Required Role**: Assigned worker or MANAGER

Request:
```json
{
  "progress": 75
}
```

Response (200): Updated work order

---

## 4. Work Log Management

### Get All Work Logs
**GET** `/api/work-logs`
- **Optional Query Parameters**:
  - `workOrderId`: Filter by work order
  - `userId`: Filter by user
  - `action`: CREATE, UPDATE, START, PAUSE, RESUME, COMPLETE, CANCEL
  - `startDate`: ISO date string
  - `endDate`: ISO date string

Response (200):
```json
[
  {
    "id": 1,
    "workOrderId": 1,
    "workOrderNumber": "WO-2025-001",
    "userId": 3,
    "userName": "작업자",
    "action": "START",
    "description": "작업 시작",
    "beforeStatus": "PENDING",
    "afterStatus": "IN_PROGRESS",
    "quantityProduced": 0,
    "loggedAt": "2025-08-10T13:00:00"
  }
]
```

### Get Work Log by ID
**GET** `/api/work-logs/{id}`

Response (200): Single work log object

### Create Work Log
**POST** `/api/work-logs`

Request:
```json
{
  "workOrderId": 1,
  "action": "UPDATE",
  "description": "진행률 업데이트",
  "quantityProduced": 25
}
```

Response (201): Created work log object

### Get Logs by Work Order
**GET** `/api/work-logs/work-order/{workOrderId}`

Response (200): Array of work logs for specific work order

---

## 5. Issue Management

### Get All Issues
**GET** `/api/issues`
- **Optional Query Parameters**:
  - `status`: OPEN, IN_PROGRESS, RESOLVED, CLOSED
  - `priority`: LOW, MEDIUM, HIGH, CRITICAL
  - `type`: QUALITY, EQUIPMENT, MATERIAL, PROCESS, SAFETY, OTHER
  - `reportedBy`: User ID

Response (200):
```json
[
  {
    "id": 1,
    "title": "장비 오작동",
    "description": "3번 라인 장비 오류 발생",
    "type": "EQUIPMENT",
    "priority": "HIGH",
    "status": "OPEN",
    "workOrderId": 1,
    "workOrderNumber": "WO-2025-001",
    "reportedById": 3,
    "reportedByName": "작업자",
    "assignedToId": 2,
    "assignedToName": "매니저",
    "resolution": null,
    "reportedAt": "2025-08-10T14:00:00",
    "resolvedAt": null
  }
]
```

### Get Issue by ID
**GET** `/api/issues/{id}`

Response (200): Single issue object

### Create Issue
**POST** `/api/issues`

Request:
```json
{
  "title": "품질 문제",
  "description": "제품 불량 발견",
  "type": "QUALITY",
  "priority": "MEDIUM",
  "workOrderId": 1
}
```

Response (201): Created issue object

### Update Issue
**PUT** `/api/issues/{id}`
- **Required Role**: MANAGER, ADMIN, or assigned user

Request:
```json
{
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "assignedToId": 2,
  "resolution": "문제 해결 중"
}
```

Response (200): Updated issue object

### Delete Issue
**DELETE** `/api/issues/{id}`
- **Required Role**: ADMIN

Response (204): No content

### Resolve Issue
**PUT** `/api/issues/{id}/resolve`
- **Required Role**: MANAGER, ADMIN, or assigned user

Request:
```json
{
  "resolution": "장비 교체 완료"
}
```

Response (200): Issue with status "RESOLVED"

---

## 6. Dashboard & Statistics

### Get Dashboard Statistics
**GET** `/api/dashboard/stats`

Response (200):
```json
{
  "totalWorkOrders": 45,
  "pendingWorkOrders": 12,
  "inProgressWorkOrders": 8,
  "completedWorkOrders": 25,
  "totalIssues": 15,
  "openIssues": 5,
  "resolvedIssues": 10,
  "todayWorkOrders": 3,
  "todayCompletedOrders": 2,
  "averageCompletionRate": 95.5,
  "onTimeDeliveryRate": 88.0
}
```

### Get Recent Work Orders
**GET** `/api/dashboard/recent-work-orders`
- **Query Parameter**: `limit` (default: 10)

Response (200): Array of recent work orders

### Get Recent Issues
**GET** `/api/dashboard/recent-issues`
- **Query Parameter**: `limit` (default: 10)

Response (200): Array of recent issues

### Get Recent Activities
**GET** `/api/dashboard/recent-activities`
- **Query Parameter**: `limit` (default: 20)

Response (200):
```json
[
  {
    "id": 1,
    "type": "WORK_ORDER",
    "action": "CREATED",
    "description": "작업 지시서 WO-2025-001 생성됨",
    "userId": 1,
    "userName": "관리자",
    "timestamp": "2025-08-10T12:52:38"
  }
]
```

### Get Production Summary
**GET** `/api/dashboard/production-summary`
- **Query Parameters**: 
  - `startDate`: ISO date string
  - `endDate`: ISO date string

Response (200):
```json
{
  "totalQuantityOrdered": 1500,
  "totalQuantityProduced": 1420,
  "productionRate": 94.67,
  "byProduct": [
    {
      "productName": "제품 A",
      "ordered": 500,
      "produced": 480,
      "rate": 96.0
    }
  ],
  "byDate": [
    {
      "date": "2025-08-10",
      "ordered": 200,
      "produced": 195
    }
  ]
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2025-08-10T12:52:28.774716",
  "errors": {
    "fieldName": "Error message"
  }
}
```

## HTTP Status Codes
- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **204**: No Content - Request successful, no content to return
- **400**: Bad Request - Invalid request data
- **401**: Unauthorized - Authentication required or failed
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **500**: Internal Server Error - Server error

## Test Credentials
- **Admin**: admin@mes.com / admin123
- **Manager**: manager@mes.com / manager123
- **Worker**: worker@mes.com / worker123

## CORS Settings
Allowed origins:
- http://localhost:3000
- http://localhost:5173

## Notes for Frontend Development
1. Always include JWT token in Authorization header after login
2. Handle token expiration and refresh automatically
3. Store token securely (HttpOnly cookies recommended for production)
4. Implement role-based UI rendering based on user role
5. Handle error responses appropriately with user-friendly messages
6. Use ISO 8601 format for all date/time fields
7. All timestamps are in UTC