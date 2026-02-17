-- =====================================================
-- 초기 데이터 설정
-- =====================================================

-- 초기 관리자 계정 생성 (비밀번호: admin123을 BCrypt로 암호화)
INSERT INTO users (email, name, role, password, is_active, created_at, updated_at)
VALUES ('admin@mes.com', '관리자', 'ADMIN', '$2a$10$8.U4Xg4YFt8pE5qV1Q6Mj.z1YVqGPVxPvQxXr5vUqVwHGr6B8Lcmu', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- 테스트용 사용자 계정 생성
INSERT INTO users (email, name, role, password, is_active, created_at, updated_at)
VALUES ('manager@mes.com', '매니저', 'MANAGER', '$2a$10$8.U4Xg4YFt8pE5qV1Q6Mj.z1YVqGPVxPvQxXr5vUqVwHGr6B8Lcmu', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO users (email, name, role, password, is_active, created_at, updated_at)
VALUES ('worker@mes.com', '작업자', 'WORKER', '$2a$10$8.U4Xg4YFt8pE5qV1Q6Mj.z1YVqGPVxPvQxXr5vUqVwHGr6B8Lcmu', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;
