// API 테스트 스크립트
// 실행: node test-api.js

const API_BASE_URL = 'http://localhost:8080/api';
let authToken = null;
let refreshToken = null;

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// 테스트 결과 출력
function logTest(endpoint, method, status, success, data = null, error = null) {
  const statusColor = success ? colors.green : colors.red;
  console.log(`${statusColor}[${method}] ${endpoint} - ${status}${colors.reset}`);
  if (data) {
    console.log(`${colors.blue}Response:${colors.reset}`, JSON.stringify(data, null, 2));
  }
  if (error) {
    console.log(`${colors.red}Error:${colors.reset}`, error.message || error);
  }
  console.log('---');
}

// API 요청 헬퍼
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (authToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.text();
    let jsonData = null;
    
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: jsonData,
      headers: response.headers
    };
  } catch (error) {
    return {
      ok: false,
      status: 'Network Error',
      error: error.message
    };
  }
}

// 테스트 함수들
async function testAuth() {
  console.log(`\n${colors.magenta}=== AUTH API 테스트 ===${colors.reset}\n`);

  // 1. 로그인 테스트
  const loginResult = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123'
    })
  });

  logTest('/auth/login', 'POST', loginResult.status, loginResult.ok, loginResult.data, loginResult.error);
  
  if (loginResult.ok && loginResult.data) {
    authToken = loginResult.data.accessToken || loginResult.data.token;
    refreshToken = loginResult.data.refreshToken;
  }

  // 2. 토큰 갱신 테스트
  if (refreshToken) {
    const refreshResult = await apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true
    });
    
    logTest('/auth/refresh', 'POST', refreshResult.status, refreshResult.ok, refreshResult.data, refreshResult.error);
  }

  // 3. 로그아웃 테스트
  if (authToken) {
    const logoutResult = await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token: authToken })
    });
    
    logTest('/auth/logout', 'POST', logoutResult.status, logoutResult.ok, logoutResult.data, logoutResult.error);
  }
}

async function testDashboard() {
  console.log(`\n${colors.magenta}=== DASHBOARD API 테스트 ===${colors.reset}\n`);

  // 대시보드 통계
  const statsResult = await apiRequest('/dashboard/stats', {
    method: 'GET'
  });
  
  logTest('/dashboard/stats', 'GET', statsResult.status, statsResult.ok, statsResult.data, statsResult.error);

  // 최근 활동
  const activitiesResult = await apiRequest('/dashboard/recent-activities', {
    method: 'GET'
  });
  
  logTest('/dashboard/recent-activities', 'GET', activitiesResult.status, activitiesResult.ok, activitiesResult.data, activitiesResult.error);

  // 생산 현황
  const productionResult = await apiRequest('/dashboard/production-status', {
    method: 'GET'
  });
  
  logTest('/dashboard/production-status', 'GET', productionResult.status, productionResult.ok, productionResult.data, productionResult.error);
}

async function testWorkOrders() {
  console.log(`\n${colors.magenta}=== WORK ORDERS API 테스트 ===${colors.reset}\n`);

  // 1. 작업 지시 목록 조회
  const listResult = await apiRequest('/work-orders', {
    method: 'GET'
  });
  
  logTest('/work-orders', 'GET', listResult.status, listResult.ok, listResult.data, listResult.error);

  // 2. 작업 지시 생성
  const createResult = await apiRequest('/work-orders', {
    method: 'POST',
    body: JSON.stringify({
      title: 'API 테스트 작업 지시',
      description: 'API 테스트를 위한 작업 지시입니다.',
      priority: 'NORMAL',
      status: 'PENDING',
      dueDate: new Date().toISOString()
    })
  });
  
  logTest('/work-orders', 'POST', createResult.status, createResult.ok, createResult.data, createResult.error);

  // 3. 생성된 작업 지시 ID로 조회
  if (createResult.ok && createResult.data && createResult.data.id) {
    const workOrderId = createResult.data.id;
    
    // 단일 조회
    const getResult = await apiRequest(`/work-orders/${workOrderId}`, {
      method: 'GET'
    });
    
    logTest(`/work-orders/${workOrderId}`, 'GET', getResult.status, getResult.ok, getResult.data, getResult.error);

    // 수정
    const updateResult = await apiRequest(`/work-orders/${workOrderId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'API 테스트 작업 지시 (수정됨)',
        status: 'IN_PROGRESS'
      })
    });
    
    logTest(`/work-orders/${workOrderId}`, 'PUT', updateResult.status, updateResult.ok, updateResult.data, updateResult.error);

    // 삭제
    const deleteResult = await apiRequest(`/work-orders/${workOrderId}`, {
      method: 'DELETE'
    });
    
    logTest(`/work-orders/${workOrderId}`, 'DELETE', deleteResult.status, deleteResult.ok, deleteResult.data, deleteResult.error);
  }
}

async function testIssues() {
  console.log(`\n${colors.magenta}=== ISSUES API 테스트 ===${colors.reset}\n`);

  // 1. 이슈 목록 조회
  const listResult = await apiRequest('/issues', {
    method: 'GET'
  });
  
  logTest('/issues', 'GET', listResult.status, listResult.ok, listResult.data, listResult.error);

  // 2. 이슈 생성
  const createResult = await apiRequest('/issues', {
    method: 'POST',
    body: JSON.stringify({
      title: 'API 테스트 이슈',
      description: 'API 테스트를 위한 이슈입니다.',
      type: 'EQUIPMENT',
      priority: 'MEDIUM',
      status: 'OPEN'
    })
  });
  
  logTest('/issues', 'POST', createResult.status, createResult.ok, createResult.data, createResult.error);

  // 3. 생성된 이슈 ID로 작업
  if (createResult.ok && createResult.data && createResult.data.id) {
    const issueId = createResult.data.id;
    
    // 단일 조회
    const getResult = await apiRequest(`/issues/${issueId}`, {
      method: 'GET'
    });
    
    logTest(`/issues/${issueId}`, 'GET', getResult.status, getResult.ok, getResult.data, getResult.error);

    // 수정
    const updateResult = await apiRequest(`/issues/${issueId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'IN_PROGRESS',
        priority: 'HIGH'
      })
    });
    
    logTest(`/issues/${issueId}`, 'PUT', updateResult.status, updateResult.ok, updateResult.data, updateResult.error);

    // 삭제
    const deleteResult = await apiRequest(`/issues/${issueId}`, {
      method: 'DELETE'
    });
    
    logTest(`/issues/${issueId}`, 'DELETE', deleteResult.status, deleteResult.ok, deleteResult.data, deleteResult.error);
  }
}

async function testUsers() {
  console.log(`\n${colors.magenta}=== USERS API 테스트 ===${colors.reset}\n`);

  // 1. 사용자 목록 조회
  const listResult = await apiRequest('/users', {
    method: 'GET'
  });
  
  logTest('/users', 'GET', listResult.status, listResult.ok, listResult.data, listResult.error);

  // 2. 현재 사용자 정보
  const meResult = await apiRequest('/users/me', {
    method: 'GET'
  });
  
  logTest('/users/me', 'GET', meResult.status, meResult.ok, meResult.data, meResult.error);

  // 3. 사용자 생성 (관리자 권한 필요)
  const createResult = await apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      password: 'test123',
      role: 'WORKER',
      name: 'Test User',
      email: 'test@example.com'
    })
  });
  
  logTest('/users', 'POST', createResult.status, createResult.ok, createResult.data, createResult.error);

  // 4. 생성된 사용자 작업
  if (createResult.ok && createResult.data && createResult.data.id) {
    const userId = createResult.data.id;
    
    // 단일 조회
    const getResult = await apiRequest(`/users/${userId}`, {
      method: 'GET'
    });
    
    logTest(`/users/${userId}`, 'GET', getResult.status, getResult.ok, getResult.data, getResult.error);

    // 수정
    const updateResult = await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Test User',
        role: 'MANAGER'
      })
    });
    
    logTest(`/users/${userId}`, 'PUT', updateResult.status, updateResult.ok, updateResult.data, updateResult.error);

    // 삭제
    const deleteResult = await apiRequest(`/users/${userId}`, {
      method: 'DELETE'
    });
    
    logTest(`/users/${userId}`, 'DELETE', deleteResult.status, deleteResult.ok, deleteResult.data, deleteResult.error);
  }
}

// 메인 실행 함수
async function runAllTests() {
  console.log(`${colors.yellow}========================================`);
  console.log(`     Smart Factory MES API 테스트`);
  console.log(`     Backend URL: ${API_BASE_URL}`);
  console.log(`========================================${colors.reset}`);

  // 서버 연결 확인
  console.log(`\n${colors.blue}서버 연결 확인 중...${colors.reset}`);
  const healthCheck = await apiRequest('/health', { method: 'GET' });
  
  if (!healthCheck.ok && healthCheck.status === 'Network Error') {
    console.log(`${colors.red}❌ 백엔드 서버에 연결할 수 없습니다.${colors.reset}`);
    console.log(`${colors.yellow}서버가 http://localhost:8080 에서 실행 중인지 확인하세요.${colors.reset}\n`);
    process.exit(1);
  }

  // 각 API 테스트 실행
  await testAuth();
  await testDashboard();
  await testWorkOrders();
  await testIssues();
  await testUsers();

  console.log(`\n${colors.green}✅ 모든 API 테스트 완료${colors.reset}\n`);
}

// 실행
runAllTests().catch(error => {
  console.error(`${colors.red}테스트 실행 중 오류:${colors.reset}`, error);
  process.exit(1);
});