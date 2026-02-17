-- =====================================================
-- work_orders 테이블 COMMENT 업데이트 (1회 실행)
-- 데이터 유지하면서 COMMENT만 추가
-- =====================================================

-- 테이블 COMMENT
ALTER TABLE work_orders COMMENT = '작업 지시서';

-- 컬럼 COMMENT (기존 컬럼 정의 유지)
ALTER TABLE work_orders MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT '고유 ID';
ALTER TABLE work_orders MODIFY COLUMN order_number VARCHAR(20) NOT NULL COMMENT '발주번호 (형식: YYYYMMDD + 순번 3자리, 예: 20251205001)';
ALTER TABLE work_orders MODIFY COLUMN supply_type VARCHAR(255) NOT NULL COMMENT '공급구분 (PRIMARY: 원청, SUBCONTRACT: 하청)';
ALTER TABLE work_orders MODIFY COLUMN company_name VARCHAR(255) NOT NULL COMMENT '업체명';
ALTER TABLE work_orders MODIFY COLUMN product_name VARCHAR(255) NOT NULL COMMENT '제품명';
ALTER TABLE work_orders MODIFY COLUMN product_code VARCHAR(255) COMMENT '제품코드';
ALTER TABLE work_orders MODIFY COLUMN quantity INT NOT NULL COMMENT '수량';
ALTER TABLE work_orders MODIFY COLUMN unit VARCHAR(255) COMMENT '단위 (EA, BOX, KG 등)';
ALTER TABLE work_orders MODIFY COLUMN due_date DATETIME(6) NOT NULL COMMENT '마감일';
ALTER TABLE work_orders MODIFY COLUMN priority VARCHAR(255) NOT NULL COMMENT '우선순위 (LOW, MEDIUM, HIGH, URGENT)';
ALTER TABLE work_orders MODIFY COLUMN status VARCHAR(255) NOT NULL COMMENT '상태 (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)';
ALTER TABLE work_orders MODIFY COLUMN work_type VARCHAR(255) COMMENT '작업유형 (PRODUCTION, ASSEMBLY, PACKAGING, INSPECTION, OTHER)';
ALTER TABLE work_orders MODIFY COLUMN instructions TEXT COMMENT '설명/작업지시 내용';
ALTER TABLE work_orders MODIFY COLUMN selection VARCHAR(255) COMMENT '선택 옵션';
ALTER TABLE work_orders MODIFY COLUMN attachment_url VARCHAR(255) COMMENT '파일첨부 URL (보류)';
ALTER TABLE work_orders MODIFY COLUMN progress INT NOT NULL COMMENT '진행률 (0-100)';
ALTER TABLE work_orders MODIFY COLUMN assigned_to_id BIGINT COMMENT '담당자 ID';
ALTER TABLE work_orders MODIFY COLUMN started_at DATETIME(6) COMMENT '작업 시작 시간';
ALTER TABLE work_orders MODIFY COLUMN completed_at DATETIME(6) COMMENT '작업 완료 시간';
ALTER TABLE work_orders MODIFY COLUMN created_at DATETIME(6) COMMENT '생성 시간';
ALTER TABLE work_orders MODIFY COLUMN updated_at DATETIME(6) COMMENT '수정 시간';
ALTER TABLE work_orders MODIFY COLUMN actual_quantity INT COMMENT '실제 생산 수량';
ALTER TABLE work_orders MODIFY COLUMN notes TEXT COMMENT '비고';
