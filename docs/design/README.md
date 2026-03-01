# MES 시스템 피그마 설계 문서

PackFlow Smart Factory MES 시스템의 피그마 설계안 작성을 위한 참조 문서입니다.

## 문서 구조

```
docs/design/
├── README.md                 # 개요 (현재 문서)
├── pages/                    # 페이지별 기능 명세
│   ├── 01-login.md
│   ├── 02-dashboard.md
│   ├── 03-work-orders.md
│   └── 04-issues.md
├── components/               # 위젯/컴포넌트 명세
│   ├── 01-navigation.md
│   ├── 02-tables.md
│   ├── 03-forms.md
│   └── 04-modals.md
├── design-system/            # 디자인 시스템
│   └── 01-tokens.md
└── api/                      # API 참조
    └── 01-endpoints.md
```

## 페이지 맵

```
/login                    로그인 (공개)
/                         대시보드
├── /production           생산관리 목록
├── /production/new       생산관리 등록
├── /production/:id       생산관리 상세
├── /production/:id/edit  생산관리 수정
├── /issues               이슈관리 목록
├── /issues/new           이슈 등록
├── /issues/:id           이슈 상세
└── /issues/:id/edit      이슈 수정
```

## 사용자 역할

| 역할 | 권한 |
|------|------|
| ADMIN | 전체 접근 |
| MANAGER | 작업 지시서 관리 |
| WORKER | 할당된 작업만 |
