# EC2 빌드 문제 해결 가이드

## 문제: EC2에서 빌드가 멈추는 현상

### 원인
1. **메모리 부족**: EC2 t2.micro는 1GB RAM으로 제한적
2. **TypeScript 컴파일과 Vite 빌드가 동시 실행**되며 메모리 과다 사용
3. **빌드 캐시 누적**으로 인한 추가 메모리 사용

### 해결 방법

## 1. 최적화된 빌드 스크립트 사용
```bash
# EC2에서 git pull 후 실행
cd frontend
./build-ec2.sh
```

## 2. 수동 빌드 명령어
```bash
# 메모리 제한 설정하여 빌드
npm run build:ec2

# 캐시 정리 후 빌드
npm run build:clean

# 디버그 모드로 빌드 (문제 진단용)
npm run build:debug
```

## 3. 긴급 대응 방법
```bash
# 1. 모든 Node 프로세스 종료
pkill -f node

# 2. 빌드 캐시 완전 삭제
cd frontend
rm -rf dist node_modules/.vite .tsbuildinfo

# 3. 메모리 상태 확인
free -h

# 4. swap 메모리 추가 (필요시)
sudo dd if=/dev/zero of=/swapfile bs=128M count=8
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 5. 빌드 재시도
NODE_OPTIONS='--max-old-space-size=512' npm run build
```

## 4. 빌드 프로세스 모니터링
```bash
# 다른 터미널에서 실행
watch -n 1 'free -h; echo "---"; ps aux | grep node | grep -v grep'
```

## 5. Nginx 서비스 재시작
```bash
# 빌드 완료 후
sudo systemctl restart nginx
sudo systemctl status nginx
```

## 최적화 내용

### Vite 설정 개선 (vite.config.ts)
- TypeScript 빌드 최적화
- 청크 분할로 메모리 사용량 감소
- 소스맵 비활성화
- 병렬 처리 제한 (maxParallelFileOps: 2)

### Package.json 스크립트 추가
- `build:ec2`: 메모리 제한 빌드
- `build:clean`: 캐시 정리 후 빌드
- `build:debug`: 디버그 모드 빌드

## 예상 빌드 시간
- 로컬 환경: 1-2초
- EC2 t2.micro: 30-60초 (최적화 후)

## 추천 사항
1. 가능하면 **t2.small** (2GB RAM) 이상 인스턴스 사용
2. 빌드는 로컬에서 수행 후 dist 폴더만 배포
3. GitHub Actions 등 CI/CD 파이프라인 구축 고려