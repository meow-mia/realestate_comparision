# 부동산 실거래가 비교 서비스

두 개의 아파트를 선택하여 실거래가의 변화를 비교하고 어떤 아파트가 더 좋은 투자였는지 판단할 수 있는 웹 서비스입니다.

## 주요 기능

### 1. 아파트 검색 및 선택
- 한글로 아파트명을 입력하면 자동완성 기능 제공
- 선택한 아파트의 평형(면적) 선택 가능

### 2. 실거래가 그래프 비교
- 두 개의 아파트 실거래가를 한 화면에서 비교
- 꺾은선 그래프로 시각화
- X축: 기간 (YYMM 형식)
- Y축: 가격 (억 단위)

### 3. 기간 선택
- 기본 3년 조회
- 5년, 10년으로 확대 가능

### 4. 실거래 데이터 표시
- 실거래가가 있었던 달은 그래프 위에 점으로 표시
- 마우스 오버 시 정확한 가격 표시 (X억 XXXX만원)

### 5. 투자 분석
- 각 아파트의 현재가, 변동률, 최고가, 최저가 통계
- 두 아파트의 수익률 비교 분석

## 기술 스택

### Backend
- **Flask**: Python 웹 프레임워크
- **Flask-CORS**: CORS 처리
- **Requests**: 외부 API 호출
- **python-dateutil**: 날짜 처리

### Frontend
- **React**: UI 프레임워크
- **Chart.js**: 그래프 라이브러리
- **react-chartjs-2**: Chart.js React 래퍼
- **Axios**: HTTP 클라이언트
- **CSS3**: 스타일링

## 설치 방법

### 1. Python 환경 설정 (Backend)

```bash
# 1. 프로젝트 루트 디렉토리로 이동
cd "C:\Users\USER\Desktop\2026년\.vibe coding_working\부동산 데이터"

# 2. 가상환경 생성 (선택사항)
python -m venv venv

# 3. 가상환경 활성화 (선택사항)
# Windows:
venv\Scripts\activate

# 4. 패키지 설치
pip install -r requirements.txt
```

### 2. Node.js 환경 설정 (Frontend)

```bash
# 1. frontend 디렉토리로 이동
cd frontend

# 2. npm 패키지 설치
npm install
```

## 실행 방법

### 1. Backend 서버 실행

```bash
# 프로젝트 루트 디렉토리에서
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

### 2. Frontend 개발 서버 실행

```bash
# frontend 디렉토리에서
cd frontend
npm start
```

브라우저가 자동으로 열리며 `http://localhost:3000`에서 앱을 확인할 수 있습니다.

## 사용 방법

1. **아파트 선택**
   - 첫 번째 입력란에 비교할 첫 번째 아파트명 입력
   - 자동완성 목록에서 아파트 선택
   - 평형(면적) 선택

2. **두 번째 아파트 선택**
   - 두 번째 입력란에 비교할 두 번째 아파트명 입력
   - 자동완성 목록에서 아파트 선택
   - 평형(면적) 선택

3. **조회 기간 설정**
   - 3년, 5년, 10년 중 선택 (기본값: 3년)

4. **비교하기**
   - "비교하기" 버튼 클릭
   - 그래프와 통계 정보 확인

## API 엔드포인트

### Backend API

#### 1. 아파트 자동완성
```
GET /api/search/autocomplete?keyword={검색어}&page=1&size=10
```

#### 2. 단지 정보 조회
```
GET /api/complex/{단지번호}
```

#### 3. 평형 정보 조회
```
GET /api/complex/{단지번호}/pyeong-types
```

#### 4. 실거래가 조회
```
GET /api/real-price?complexNumber={단지번호}&pyeongTypeNumber={평형번호}&years={기간}
```

#### 5. 헬스 체크
```
GET /health
```

## 프로젝트 구조

```
부동산 데이터/
├── app.py                          # Flask 백엔드 서버
├── requirements.txt                # Python 패키지 목록
├── README.md                       # 프로젝트 문서
├── API List/                       # API 문서
│   ├── 단지_API_정리.md
│   ├── 매물_API_정리.md
│   └── 법정동_API_정리.md
├── UI Reference/                   # 디자인 참고 자료
│   └── Screenshot 2026-01-29.png
└── frontend/                       # React 프론트엔드
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                  # 메인 앱 컴포넌트
        ├── App.css                 # 앱 스타일
        ├── index.js                # 엔트리 포인트
        ├── index.css               # 글로벌 스타일
        └── components/             # 컴포넌트
            ├── ComparisonForm.js   # 비교 폼
            ├── ComparisonForm.css
            ├── ComparisonChart.js  # 그래프 차트
            └── ComparisonChart.css
```

## 주요 기능 설명

### 1. 자동완성 검색
- 네이버 부동산 API를 활용한 실시간 아파트명 검색
- 최소 2글자 이상 입력 시 작동
- 아파트명과 주소 정보 표시

### 2. 실거래가 데이터 처리
- 월별로 거래 데이터를 그룹화
- 평균가, 최저가, 최고가 계산
- YYMM 형식으로 날짜 표시

### 3. 그래프 시각화
- Chart.js를 활용한 반응형 꺾은선 그래프
- 두 아파트를 다른 색상으로 구분
- 마우스 오버 시 상세 정보 툴팁 표시
- 억/만원 단위로 가격 표시

### 4. 투자 분석
- 각 아파트의 가격 변동률 계산
- 두 아파트 간 수익률 비교
- 투자 가치 판단 정보 제공

## 참고 사항

- 실거래가 데이터는 네이버 부동산 개발 서버 API를 사용합니다
- API 서버: `https://realestate-be-dev.io.naver.com`
- 실제 운영 환경에서는 인증이 필요할 수 있습니다

## 트러블슈팅

### Backend 서버가 시작되지 않는 경우
```bash
# Flask 및 필수 패키지가 설치되었는지 확인
pip list

# 패키지 재설치
pip install -r requirements.txt --force-reinstall
```

### Frontend가 빌드되지 않는 경우
```bash
# node_modules 삭제 후 재설치
cd frontend
rm -rf node_modules
npm install
```

### CORS 오류가 발생하는 경우
- Backend 서버가 정상적으로 실행 중인지 확인
- Flask-CORS가 설치되어 있는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

## 향후 개선 사항

- [ ] 사용자 인증 및 즐겨찾기 기능
- [ ] 여러 아파트 동시 비교 (3개 이상)
- [ ] 지역별 평균 시세 비교
- [ ] PDF 리포트 다운로드
- [ ] 모바일 앱 반응형 최적화
- [ ] 실시간 알림 기능

## 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
