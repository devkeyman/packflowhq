#!/usr/bin/env node

import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';
let accessToken = '';

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// API 요청 헬퍼
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken ? `Bearer ${accessToken}` : undefined,
        ...options.headers
      },
      data: options.data,
      params: options.params
    });

    return {
      ok: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      ok: false,
      status: error.response?.status || 'Network Error',
      error: error.response?.data || error.message
    };
  }
}

// 테스트 결과 출력
function logTest(endpoint, method, status, success, data, error) {
  const statusColor = success ? colors.green : colors.red;
  const statusText = success ? '✓' : '✗';

  console.log(`${statusColor}${statusText}${colors.reset} ${method} ${endpoint}`);
  console.log(`  Status: ${status}`);

  if (success && data) {
    console.log(`  Response:`, JSON.stringify(data, null, 2).split('\n').map((line, i) => i === 0 ? line : `    ${line}`).join('\n'));
  } else if (error) {
    console.log(`  Error:`, colors.red, JSON.stringify(error, null, 2).split('\n').map((line, i) => i === 0 ? line : `    ${line}`).join('\n'), colors.reset);
  }
  console.log('');
}

// 로그인
async function login() {
  console.log(`${colors.cyan}=== 인증 테스트 ===${colors.reset}\n`);

  const loginData = {
    email: 'admin@mes.com',
    password: 'admin123'
  };

  const result = await apiRequest('/auth/login', {
    method: 'POST',
    data: loginData
  });

  logTest('/auth/login', 'POST', result.status, result.ok, result.data, result.error);

  if (result.ok) {
    accessToken = result.data.token || result.data.accessToken;
    console.log(`${colors.green}✓ 로그인 성공! 토큰 획득${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}✗ 로그인 실패! 테스트를 중단합니다.${colors.reset}\n`);
    return false;
  }
}

// 대시보드 API 테스트
async function testDashboardAPIs() {
  console.log(`${colors.cyan}=== 대시보드 API 테스트 ===${colors.reset}\n`);

  // 1. 대시보드 통계
  console.log(`${colors.yellow}1. 대시보드 통계 (GET /dashboard/stats)${colors.reset}`);
  const statsResult = await apiRequest('/dashboard/stats');
  logTest('/dashboard/stats', 'GET', statsResult.status, statsResult.ok, statsResult.data, statsResult.error);

  if (statsResult.ok) {
    const expectedFields = [
      'totalWorkOrders', 'pendingWorkOrders', 'inProgressWorkOrders', 'completedWorkOrders',
      'totalIssues', 'openIssues', 'resolvedIssues', 'todayWorkOrders',
      'todayCompletedOrders', 'averageCompletionRate', 'onTimeDeliveryRate'
    ];

    const missingFields = expectedFields.filter(field => !(field in statsResult.data));
    if (missingFields.length > 0) {
      console.log(`  ${colors.yellow}⚠ 누락된 필드: ${missingFields.join(', ')}${colors.reset}\n`);
    } else {
      console.log(`  ${colors.green}✓ 모든 필드 확인 완료${colors.reset}\n`);
    }
  }

  // 2. 생산 요약
  console.log(`${colors.yellow}2. 생산 요약 (GET /dashboard/production-summary)${colors.reset}`);
  const prodSummaryResult = await apiRequest('/dashboard/production-summary');
  logTest('/dashboard/production-summary', 'GET', prodSummaryResult.status, prodSummaryResult.ok, prodSummaryResult.data, prodSummaryResult.error);

  if (prodSummaryResult.ok) {
    const expectedFields = ['totalQuantityOrdered', 'totalQuantityProduced', 'productionRate', 'byProduct', 'byDate'];
    const missingFields = expectedFields.filter(field => !(field in prodSummaryResult.data));
    if (missingFields.length > 0) {
      console.log(`  ${colors.yellow}⚠ 누락된 필드: ${missingFields.join(', ')}${colors.reset}\n`);
    } else {
      console.log(`  ${colors.green}✓ 모든 필드 확인 완료${colors.reset}\n`);
    }
  }

  // 3. 최근 활동
  console.log(`${colors.yellow}3. 최근 활동 (GET /dashboard/recent-activities)${colors.reset}`);
  const activitiesResult = await apiRequest('/dashboard/recent-activities', {
    params: { limit: 5 }
  });
  logTest('/dashboard/recent-activities?limit=5', 'GET', activitiesResult.status, activitiesResult.ok, activitiesResult.data, activitiesResult.error);

  if (activitiesResult.ok && Array.isArray(activitiesResult.data)) {
    if (activitiesResult.data.length > 0) {
      const activity = activitiesResult.data[0];
      const expectedFields = ['id', 'type', 'action', 'description', 'userId', 'userName', 'timestamp'];
      const missingFields = expectedFields.filter(field => !(field in activity));
      if (missingFields.length > 0) {
        console.log(`  ${colors.yellow}⚠ 누락된 필드: ${missingFields.join(', ')}${colors.reset}\n`);
      } else {
        console.log(`  ${colors.green}✓ 모든 필드 확인 완료${colors.reset}\n`);
      }
    } else {
      console.log(`  ${colors.yellow}⚠ 빈 배열 반환${colors.reset}\n`);
    }
  }

  // 4. 최근 작업 지시서
  console.log(`${colors.yellow}4. 최근 작업 지시서 (GET /dashboard/recent-work-orders)${colors.reset}`);
  const workOrdersResult = await apiRequest('/dashboard/recent-work-orders', {
    params: { limit: 5 }
  });
  logTest('/dashboard/recent-work-orders?limit=5', 'GET', workOrdersResult.status, workOrdersResult.ok, workOrdersResult.data, workOrdersResult.error);

  if (workOrdersResult.ok && Array.isArray(workOrdersResult.data)) {
    if (workOrdersResult.data.length > 0) {
      const workOrder = workOrdersResult.data[0];
      const expectedFields = ['id', 'orderNumber', 'productName', 'quantity', 'status', 'priority', 'progress', 'dueDate', 'createdAt'];
      const missingFields = expectedFields.filter(field => !(field in workOrder));
      if (missingFields.length > 0) {
        console.log(`  ${colors.yellow}⚠ 누락된 필드: ${missingFields.join(', ')}${colors.reset}\n`);
      } else {
        console.log(`  ${colors.green}✓ 모든 필드 확인 완료${colors.reset}\n`);
      }
    } else {
      console.log(`  ${colors.yellow}⚠ 빈 배열 반환${colors.reset}\n`);
    }
  }

  // 5. 최근 이슈
  console.log(`${colors.yellow}5. 최근 이슈 (GET /dashboard/recent-issues)${colors.reset}`);
  const issuesResult = await apiRequest('/dashboard/recent-issues', {
    params: { limit: 5 }
  });
  logTest('/dashboard/recent-issues?limit=5', 'GET', issuesResult.status, issuesResult.ok, issuesResult.data, issuesResult.error);

  if (issuesResult.ok && Array.isArray(issuesResult.data)) {
    if (issuesResult.data.length > 0) {
      const issue = issuesResult.data[0];
      const expectedFields = ['id', 'title', 'description', 'status', 'priority', 'type', 'workOrderId', 'reportedBy', 'createdAt'];
      const missingFields = expectedFields.filter(field => !(field in issue));
      if (missingFields.length > 0) {
        console.log(`  ${colors.yellow}⚠ 누락된 필드: ${missingFields.join(', ')}${colors.reset}\n`);
      } else {
        console.log(`  ${colors.green}✓ 모든 필드 확인 완료${colors.reset}\n`);
      }
    } else {
      console.log(`  ${colors.yellow}⚠ 빈 배열 반환${colors.reset}\n`);
    }
  }
}

// 테스트 요약 출력
function printSummary(results) {
  console.log(`${colors.cyan}=== 테스트 요약 ===${colors.reset}\n`);

  const endpoints = [
    '/dashboard/stats',
    '/dashboard/production-summary',
    '/dashboard/recent-activities',
    '/dashboard/recent-work-orders',
    '/dashboard/recent-issues'
  ];

  let successCount = 0;
  let failCount = 0;

  endpoints.forEach(endpoint => {
    // 여기서는 간단히 성공/실패만 카운트
    // 실제로는 results 배열에 저장해서 처리하는 것이 좋음
  });

  console.log(`${colors.green}성공: ${successCount}${colors.reset}`);
  console.log(`${colors.red}실패: ${failCount}${colors.reset}`);
}

// 메인 실행 함수
async function runTests() {
  console.log(`${colors.magenta}========================================`);
  console.log(`     대시보드 API 테스트`);
  console.log(`     Backend URL: ${API_BASE_URL}`);
  console.log(`========================================${colors.reset}\n`);

  // 서버 연결 확인
  console.log(`${colors.blue}서버 연결 확인 중...${colors.reset}`);
  const healthCheck = await apiRequest('/health', { method: 'GET' });

  if (!healthCheck.ok && healthCheck.status === 'Network Error') {
    console.log(`${colors.red}✗ 백엔드 서버에 연결할 수 없습니다.`);
    console.log(`  ${API_BASE_URL}가 실행 중인지 확인하세요.${colors.reset}\n`);
    process.exit(1);
  }

  // 로그인
  const loginSuccess = await login();
  if (!loginSuccess) {
    process.exit(1);
  }

  // 대시보드 API 테스트
  await testDashboardAPIs();

  console.log(`${colors.magenta}========================================`);
  console.log(`     테스트 완료`);
  console.log(`========================================${colors.reset}\n`);
}

// 테스트 실행
runTests().catch(error => {
  console.error(`${colors.red}테스트 실행 중 오류 발생:`, error, colors.reset);
  process.exit(1);
});