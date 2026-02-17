-- =====================================================
-- Innopackage Smart Factory MES Database Schema
-- =====================================================
--
-- 참고: 이 파일은 스키마 문서용입니다.
-- 실제 스키마는 Hibernate ddl-auto: update로 관리되며,
-- 컬럼 COMMENT는 Entity의 @Comment 어노테이션으로 정의됩니다.
-- =====================================================

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 ID',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT '이메일 (로그인 ID)',
    name VARCHAR(255) NOT NULL COMMENT '사용자 이름',
    role VARCHAR(50) NOT NULL DEFAULT 'WORKER' COMMENT '역할 (ADMIN: 관리자, MANAGER: 매니저, WORKER: 작업자)',
    password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호',
    is_active BOOLEAN DEFAULT TRUE COMMENT '계정 활성화 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT='사용자 정보';

-- 작업지시서 테이블
CREATE TABLE IF NOT EXISTS work_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '작업지시서 고유 ID',
    order_number VARCHAR(100) UNIQUE NOT NULL COMMENT '발주번호 (고유)',
    supply_type VARCHAR(50) COMMENT '공급구분 (PRIMARY: 원청, SUBCONTRACT: 하청)',
    company_name VARCHAR(255) COMMENT '업체명',
    product_name VARCHAR(255) NOT NULL COMMENT '제품명',
    product_code VARCHAR(100) COMMENT '제품코드',
    quantity INT NOT NULL COMMENT '수량',
    unit VARCHAR(20) DEFAULT 'EA' COMMENT '단위 (EA, BOX, SET, KG, M)',
    due_date TIMESTAMP NOT NULL COMMENT '마감일',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' COMMENT '우선순위 (LOW: 낮음, MEDIUM: 보통, HIGH: 높음, URGENT: 긴급)',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' COMMENT '상태 (PENDING: 대기, IN_PROGRESS: 진행중, PAUSED: 일시정지, COMPLETED: 완료, CANCELLED: 취소)',
    work_type VARCHAR(50) COMMENT '작업유형 (PRODUCTION: 생산, ASSEMBLY: 조립, PACKAGING: 포장, INSPECTION: 검사, OTHER: 기타)',
    instructions TEXT COMMENT '작업 지시사항',
    selection VARCHAR(255) COMMENT '선택 사항',
    progress INT DEFAULT 0 COMMENT '진행률 (0-100)',
    assigned_to_id BIGINT COMMENT '담당자 ID (users.id 참조)',
    started_at TIMESTAMP NULL COMMENT '작업 시작일시',
    completed_at TIMESTAMP NULL COMMENT '작업 완료일시',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_work_orders_status (status),
    INDEX idx_work_orders_due_date (due_date),
    INDEX idx_work_orders_assigned_to (assigned_to_id)
) COMMENT='작업지시서 정보';

-- =====================================================
-- 초기 데이터
-- =====================================================

-- 초기 관리자 계정 생성 (비밀번호는 애플리케이션에서 BCrypt 암호화 필요)
INSERT INTO users (email, name, role, password, is_active)
VALUES ('admin@mes.com', '관리자', 'ADMIN', 'admin123', TRUE)
ON DUPLICATE KEY UPDATE id=id;
