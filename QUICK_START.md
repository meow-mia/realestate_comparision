# 빠른 시작 가이드

## 준비 사항

다음 소프트웨어가 설치되어 있어야 합니다:
- Python 3.8 이상
- Node.js 14 이상
- npm 또는 yarn

## 1단계: 패키지 설치

### Backend (Python)
```bash
# 프로젝트 디렉토리로 이동
cd "C:\Users\USER\Desktop\2026년\.vibe coding_working\부동산 데이터"

# 패키지 설치
pip install -r requirements.txt
```

### Frontend (Node.js)
```bash
# frontend 디렉토리로 이동
cd frontend

# 패키지 설치
npm install
```

## 2단계: 서버 실행

### 방법 1: 자동 실행 (Windows)
프로젝트 루트에서 `start.bat` 파일을 더블클릭하세요.
- Backend와 Frontend 서버가 자동으로 시작됩니다.

### 방법 2: 수동 실행

#### Terminal 1 - Backend
```bash
python app.py
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## 3단계: 브라우저에서 확인

브라우저가 자동으로 열리지 않으면:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 사용 예시

1. **첫 번째 아파트 선택**
   - "첫 번째 아파트" 입력란에 "헬리오시티" 입력
   - 자동완성 목록에서 원하는 단지 선택
   - 평형 선택 (예: 84㎡)

2. **두 번째 아파트 선택**
   - "두 번째 아파트" 입력란에 "래미안" 입력
   - 자동완성 목록에서 원하는 단지 선택
   - 평형 선택 (예: 59㎡)

3. **기간 선택**
   - 3년, 5년, 10년 중 선택

4. **비교하기 클릭**
   - 그래프가 표시되고 통계 정보가 나타납니다

## 문제 해결

### "Module not found" 오류
```bash
# Backend
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### 포트가 이미 사용 중
- Backend: app.py에서 포트 변경 (기본: 5000)
- Frontend: package.json에서 포트 변경 (기본: 3000)

### API 호출 오류
- Backend 서버가 실행 중인지 확인
- 콘솔에서 에러 메시지 확인
- 네트워크 연결 확인

## 주요 기능

✅ 아파트 자동완성 검색
✅ 평형 선택
✅ 실거래가 그래프 비교
✅ 3년/5년/10년 기간 선택
✅ 마우스 오버 가격 표시
✅ 투자 수익률 분석

## 다음 단계

프로젝트 구조와 상세 기능은 [README.md](README.md)를 참고하세요.
