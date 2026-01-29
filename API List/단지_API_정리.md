# 부동산 단지 API 정리 문서

> 이 문서는 네이버 부동산의 단지(Complex) 관련 API를 코딩 초보자도 이해할 수 있도록 한글로 정리한 것입니다.

---

## 목차
1. [API 개요](#api-개요)
2. [기본 개념](#기본-개념)
3. [API 카테고리](#api-카테고리)

---

## API 개요

### 이 API가 뭐예요?
부동산 단지(아파트, 빌라 등의 단지)에 대한 다양한 정보를 조회하고 관리할 수 있는 API입니다.

- 단지의 상세 정보 조회
- 단지 내 평수 정보 조회
- 시세 및 실거래가 조회
- 투어 정보 관리
- VR 투어 정보 관리
- 지도 클러스터 정보 조회

### 기본 정보
| 항목 | 내용 |
|------|------|
| 서버 주소 | `https://realestate-be-dev.io.naver.com` |
| API 버전 | v0 |
| 총 API 개수 | 97개 |
| 인증 방식 | NNB 또는 NID_AUTH 쿠키 필요 |

---

## 기본 개념

### API란?
**API(Application Programming Interface)**는 **앱이나 웹사이트가 다른 서비스의 데이터나 기능을 사용할 수 있도록 하는 통로**입니다.

예를 들어:
- "네이버 지도"에서 우리 회사 위치 정보를 보여주려면 지도 API를 사용합니다
- "당신의 앱"에서 부동산 정보를 보여주려면 부동산 API를 사용합니다

### HTTP 메소드 (요청 방식)
API를 사용할 때는 항상 4가지 기본 요청 중 하나를 사용합니다:

| 메소드 | 한글명 | 예시 |
|--------|--------|------|
| **GET** | 조회 | "이 건물의 정보를 주세요" |
| **POST** | 생성/추가 | "새로운 투어 정보를 등록해주세요" |
| **PUT** | 수정 | "이 데이터를 이렇게 바꿔주세요" |
| **DELETE** | 삭제 | "이 투어 정보를 삭제해주세요" |

### 파라미터란?
API에 정보를 보낼 때 필요한 데이터를 **파라미터(Parameter)**라고 합니다.

예를 들어, "서울시 강남구의 단지를 찾아주세요"라는 요청을 할 때:
- 파라미터 1: 지역 = "서울시 강남구"
- 파라미터 2: 타입 = "아파트"

### 파라미터 위치
| 위치 | 설명 | 예시 |
|------|------|------|
| **path** | URL에 포함 | `/complex/12345` - 12345가 path 파라미터 |
| **query** | URL 뒤에 `?` 뒤에 추가 | `/complex/list?city=seoul&type=apt` |
| **body** | 요청 본문에 포함 | POST/PUT 요청의 데이터 |

### 응답 상태 코드
| 코드 | 의미 | 설명 |
|------|------|------|
| **200** | OK | 요청 성공 |
| **400** | Bad Request | 잘못된 요청 |
| **500** | Server Error | 서버 오류 |

---

## API 카테고리

총 97개의 API는 다음과 같이 분류됩니다:

- **1. kb-star-mapping-controller-impl** (1개 API)
- **2. 건축물대장** (1개 API)
- **3. 공시 가격 조회 API 컨트롤러** (2개 API)
- **4. 단지** (25개 API)
- **5. 단지 (대출 관련)** (6개 API)
- **6. 단지 (법정동 관련)** (1개 API)
- **7. 단지 VR 대표 매물 관련 API** (2개 API)
- **8. 단지 매물 정보 API** (8개 API)
- **9. 단지 클러스터 API** (3개 API)
- **10. 매물 분포 API** (1개 API)
- **11. 빌라 단지** (17개 API)
- **12. 빌라 단지 매물 API** (4개 API)
- **13. 빌라 실거래가 조회 API 컨트롤러** (3개 API)
- **14. 세금** (4개 API)
- **15. 시세** (7개 API)
- **16. 실거래가 랭킹 조회 API** (3개 API)
- **17. 실거래가 조회 API 컨트롤러** (4개 API)
- **18. 아파트 단지 조회 수** (3개 API)
- **19. 유저 단지 정보 API(주택담보대출 관련) - deprecated. favorite, my-house 모듈 참조** (3개 API)
- **20. 재개발** (1개 API)
- **21. 평당가 API** (2개 API)

---

## 1. kb-star-mapping-controller-impl (1개 API)

### 1-1. getComplexesByKbStarComplex

**HTTP 메소드**: `GET`

**URL**: `/complex/kb-star-mapping/{kbStarComplexNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| kbStarComplexNumber | path | O | string | KB 단지 번호 |

**응답 상태**: 성공(200)

---

## 2. 건축물대장 (1개 API)

### 2-1. 건축물대장 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/building-registration/{pnu}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| pnu | path | O | string | 필지고유코드 |
| realEstateTypeCode | query | X | string | 부동산 타입 코드 |

**응답 상태**: 성공(200)

---

## 3. 공시 가격 조회 API 컨트롤러 (2개 API)

### 3-1. 단지/동 기준 공시 가격 분포 리스트

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/{buildingNumber}/declared-value`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |

**응답 상태**: 성공(200)

---

### 3-2. 단지/평 기준 공시 가격 분포 리스트

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/declared-value`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평형 번호 |

**응답 상태**: 성공(200)

---

## 4. 단지 (25개 API)

### 4-1. 단지 요약 정보 다건 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/summary`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumbers | query | O | array | 단지 번호 |
| naverId | query | X | string | 네이버 ID |
| options | query | X | array | 옵션 [CSO_ATCL(매물_통계), CSO_COMM(이야기), CSO_BILD(동), C |

**응답 상태**: 성공(200)

---

### 4-2. 단지 투어 조회 API

**HTTP 메소드**: `GET`

**URL**: `/complex/target-tours`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumbers | query | X | array | 단지번호 |

**응답 상태**: 성공(200)

---

### 4-3. 단지 투어 조회 API

**HTTP 메소드**: `GET`

**URL**: `/complex/tours`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| size | query | X | integer | 조회 개수 |

**응답 상태**: 성공(200)

---

### 4-4. 단지 투어 존재하는 법정동 조회 API

**HTTP 메소드**: `GET`

**URL**: `/complex/tours/legal-divisions`

**응답 상태**: 성공(200)

---

### 4-5. 단지 투어 조회 API

**HTTP 메소드**: `GET`

**URL**: `/complex/tours/page`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| size | query | O | integer | 조회 개수 |
| page | query | O | integer | 페이지 번호 |
| sortType | query | O | string | 정렬 기준 |
| legalDivisionCode | query | X | string | 지역 코드 (10자리) |

**응답 상태**: 성공(200)

---

### 4-6. 단지 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 4-7. 단지 내 모든 동 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 4-8. 단지 내 동 기준 평형 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/pyeong`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 4-9. 단지/동 기준 면적 분포 리스트

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/{buildingNumber}/area`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |

**응답 상태**: 성공(200)

---

### 4-10. 단지/동 기준 호 리스트

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/{buildingNumber}/ho/list`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |

**응답 상태**: 성공(200)

---

[이 카테고리에는 15개의 추가 API가 있습니다]

---

## 5. 단지 (대출 관련) (6개 API)

### 5-1. 단지 동 호수 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/deal/detail/{complexNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 네이버 단지 코드 |
| loanType | query | X | string | - |

**응답 상태**: 성공(200)

---

### 5-2. 시군구 내 단지 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/deal/legal-division/{legalDivisionNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| legalDivisionNumber | path | O | string | 법정동 코드 |
| realEstateTypes | query | O | array | 부동산 타입 리스트 [A01(APARTMENT), A02(OFFICETEL), A04(RE |
| loanType | query | X | string | - |

**응답 상태**: 성공(200)

---

### 5-3. 단지 정보(대출 관련) cache 초기화

**HTTP 메소드**: `GET`

**URL**: `/complex/deal/loan/info/invalid`

**응답 상태**: 성공(200)

---

### 5-4. 단지/평형(optional)별 매칭 kb시세 기본 정보(대출 관련) cache 초기화

**HTTP 메소드**: `GET`

**URL**: `/complex/deal/loan/kb/invalid`

**응답 상태**: 성공(200)

---

### 5-5. 단지 정보(대출 관련)

**HTTP 메소드**: `GET`

**URL**: `/complex/deal/{complexNumber}/loan`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| loanType | query | X | string | - |

**응답 상태**: 성공(200)

---

### 5-6. 단지/평형(optional)별 매칭 kb시세 기본 정보(대출 관련)

**HTTP 메소드**: `GET`

**URL**: `/complex/deal/{complexNumber}/loan/kb`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumberList | query | X | array | 평형 |

**응답 상태**: 성공(200)

---

## 6. 단지 (법정동 관련) (1개 API)

### 6-1. 법정동 읍면동 단위 내 단지 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/legal-division/eup/{eupLegalDivisionNumber}/complexes`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| eupLegalDivisionNumber | path | O | string | 읍면동 법정동 코드 (10자리) |
| naverId | query | X | string | 네이버 ID |
| page | query | O | integer | 페이지 번호 |
| size | query | O | integer | 조회 개수 |
| sortType | query | O | string | 정렬 기준 |

**응답 상태**: 성공(200)

---

## 7. 단지 VR 대표 매물 관련 API (2개 API)

### 7-1. VR 대표 매물 존재 여부 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/vr/representative/{complexNumber}/{pyeongTypeNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평형 번호 |

**응답 상태**: 성공(200)

---

### 7-2. VR 대표 매물 저장

**HTTP 메소드**: `POST`

**URL**: `/complex/vr/representative/{complexNumber}/{pyeongTypeNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평형 번호 |

**응답 상태**: 성공(200)

---

## 8. 단지 매물 정보 API (8개 API)

### 8-1. 단지 동별 매물 개수 API(단지투어용)

**HTTP 메소드**: `GET`

**URL**: `/complex/tour/{complexNumber}/building/article/count`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |

**응답 상태**: 성공(200)

---

### 8-2. 특정 동 층별 매물 API(단지투어용)

**HTTP 메소드**: `GET`

**URL**: `/complex/tour/{complexNumber}/building/{buildingNumber}/article/count`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| buildingNumber | path | O | integer | 동 번호 |
| pyeongTypeNumber | query | X | integer | 평 타입 번호 |
| userChannelType | query | X | string | - |

**응답 상태**: 성공(200)

---

### 8-3. 매물 리스트 API

**HTTP 메소드**: `POST`

**URL**: `/complex/v2/{complexNumber}/article/list`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| tradeTypes | query | X | array | 거래 유형 [A1(SALE), B1(LEASE_DEPOSIT), B2(LEASE_MONTH |
| pyeongTypes | query | X | array | 평타입 |
| dongNumbers | query | X | array | 동 번호 |

**응답 상태**: 성공(200)

---

### 8-4. 매물 개수 API

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/article/count`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | query | X | integer | 평 번호 |

**응답 상태**: 성공(200)

---

### 8-5. 복수 평형, 동, 거래 타입 필터 매물 개수 API

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/article/count/filter`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| tradeTypes | query | X | array | 거래 타입 [A1(SALE), B1(LEASE_DEPOSIT), B2(LEASE_MONTH |
| pyeongTypeNumbers | query | X | array | 평 번호 |
| buildingNumbers | query | X | array | 동 번호 |

**응답 상태**: 성공(200)

---

### 8-6. 매물 개수 API

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/article/count/space`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| minimumSpace | query | O | integer | 면적 최소 : 아파트(공급면적), 오피스텔(계약면적)  |
| maximumSpace | query | O | integer | 면적 최대 : 아파트(공급면적), 오피스텔(계약면적)  |

**응답 상태**: 성공(200)

---

### 8-7. 매물 가격 API

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/article/price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | query | X | integer | 평 번호 |

**응답 상태**: 성공(200)

---

### 8-8. 복수 평형, 동, 거래 타입 필터 매물 가격 API

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/article/price/filter`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| tradeTypes | query | X | array | 거래 타입 [A1(SALE), B1(LEASE_DEPOSIT), B2(LEASE_MONTH |
| pyeongTypeNumbers | query | X | array | 평 번호 |
| buildingNumbers | query | X | array | 동 번호 |

**응답 상태**: 성공(200)

---

## 9. 단지 클러스터 API (3개 API)

### 9-1. 단지 클러스터 조회

**HTTP 메소드**: `POST`

**URL**: `/complex/map/cluster`

**응답 상태**: 성공(200)

---

### 9-2. 법정동 단지 클러스터 조회

**HTTP 메소드**: `POST`

**URL**: `/complex/map/legal-division/cluster`

**응답 상태**: 성공(200)

---

### 9-3. 단지 목록 조회

**HTTP 메소드**: `POST`

**URL**: `/complex/map/list`

**응답 상태**: 성공(200)

---

## 10. 매물 분포 API (1개 API)

### 10-1. 매물 호가 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/asking-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | query | O | integer | 단지 번호 |
| pyeongTypeNumber | query | X | integer | 평 타입 번호 |
| tradeType | query | O | string | 거래 타입 |
| realEstateType | query | O | string | 부동산 타입 |

**응답 상태**: 성공(200)

---

## 11. 빌라 단지 (17개 API)

### 11-1. 매물 호가 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/asking-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | query | O | integer | 단지 번호 |
| pyeongTypeNumber | query | X | integer | 평 타입 번호 |
| tradeType | query | O | string | 거래 타입 |
| realEstateType | query | O | string | 부동산 타입 [A05(TOWNHOUSE), A06(MULTIPLEX_HOUSE), A07( |

**응답 상태**: 성공(200)

---

### 11-2. VR 대표 매물 존재 여부 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/vr/representative/{complexNumber}/{pyeongTypeNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평형 번호 |

**응답 상태**: 성공(200)

---

### 11-3. VR 대표 매물 저장

**HTTP 메소드**: `POST`

**URL**: `/complex/villa/vr/representative/{complexNumber}/{pyeongTypeNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평형 번호 |

**응답 상태**: 성공(200)

---

### 11-4. 빌라 단지 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 11-5. 단지 내 모든 동 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 11-6. 단지 내 동 기준 평형 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building/pyeong`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 11-7. 동 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building/{buildingNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |

**응답 상태**: 성공(200)

---

### 11-8. 동의 공시 가격 분포 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building/{buildingNumber}/declared-value`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |

**응답 상태**: 성공(200)

---

### 11-9. 동호 배치도 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building/{buildingNumber}/ho`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |

**응답 상태**: 성공(200)

---

### 11-10. 호 상세 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building/{buildingNumber}/ho/{hoNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |
| hoNumber | path | O | integer | 호 번호 |

**응답 상태**: 성공(200)

---

[이 카테고리에는 7개의 추가 API가 있습니다]

---

## 12. 빌라 단지 매물 API (4개 API)

### 12-1. getVillaArticleDocumentList

**HTTP 메소드**: `POST`

**URL**: `/complex/villa/v2/{complexNumber}/article/list`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| tradeTypes | query | X | array | 거래 유형 [A1(SALE), B1(LEASE_DEPOSIT), B2(LEASE_MONTH |
| pyeongTypes | query | X | array | 평타입 |
| dongNumbers | query | X | array | 동 번호 |

**응답 상태**: 성공(200)

---

### 12-2. 매물 개수 API

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/article/count`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 빌라 단지번호 |
| pyeongTypeNumber | query | X | integer | 평 번호 |

**응답 상태**: 성공(200)

---

### 12-3. 복수 평형, 동, 거래 타입 필터 매물 개수 API

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/article/count/filter`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| tradeTypes | query | X | array | 거래 타입 [A1(SALE), B1(LEASE_DEPOSIT), B2(LEASE_MONTH |
| pyeongTypeNumbers | query | X | array | 평 번호 |
| buildingNumbers | query | X | array | 동 번호 |

**응답 상태**: 성공(200)

---

### 12-4. 복수 평형, 동, 거래 타입 필터 매물 가격 API

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/article/price/filter`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| tradeTypes | query | X | array | 거래 타입 [A1(SALE), B1(LEASE_DEPOSIT), B2(LEASE_MONTH |
| pyeongTypeNumbers | query | X | array | 평 번호 |
| buildingNumbers | query | X | array | 동 번호 |

**응답 상태**: 성공(200)

---

## 13. 빌라 실거래가 조회 API 컨트롤러 (3개 API)

### 13-1. 빌라 주변 실거래 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/real-price/around`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| left | query | O | number | 좌측 좌표 |
| right | query | O | number | 우측 좌표 |
| top | query | O | number | 상단 좌표 |
| bottom | query | O | number | 하단 좌표 |
| zoom | query | O | integer | 줌 레벨 |
| tradeType | query | O | string | 거래타입 |
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | query | X | integer | 평형 번호 |

**응답 상태**: 성공(200)

---

### 13-2. 빌라 실거래 페이지 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/real-price/page`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | query | X | integer | 평 번호 |
| tradeType | query | O | string | 거래타입 |
| page | query | O | integer | 페이지 번호 |
| size | query | O | integer | 페이지 사이즈 |

**응답 상태**: 성공(200)

---

### 13-3. 빌라 평당 실거래 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/real-price/pyeong-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | query | X | integer | 평 번호 |
| tradeType | query | O | string | 거래타입 |
| startDate | query | X | string | 조회 시작일 |

**응답 상태**: 성공(200)

---

## 14. 세금 (4개 API)

### 14-1. 특정 단지/빌딩/호 보유세 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/building/{buildingNumber}/ho-number/{hoNumber}/tax`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동(빌딩) 번호 |
| hoNumber | path | O | integer | 호 번호 |

**응답 상태**: 성공(200)

---

### 14-2. 단지/평 보유세(min/max) 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/villa/{complexNumber}/pyeong/{pyeongTypeNumber}/tax/range`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평 번호 |

**응답 상태**: 성공(200)

---

### 14-3. 특정 단지/빌딩/호 보유세 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/{buildingNumber}/ho-name/{hoName}/tax`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동(빌딩) 번호 |
| hoName | path | O | string | 호 명 |

**응답 상태**: 성공(200)

---

### 14-4. 단지/평 보유세(min/max) 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/tax/range`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평 번호 |

**응답 상태**: 성공(200)

---

## 15. 시세 (7개 API)

### 15-1. KB 시세 존재 여부 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/kb/exist`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | query | O | integer | 단지번호 |
| pyeongTypeNumber | query | X | integer | 평형번호 |

**응답 상태**: 성공(200)

---

### 15-2. 단지 최근 시세 다건 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/market-price/recent`

**설명**: 
            | 타 서비스 제공용
            | - realtors(제공처)와 monthlyRentPrice(월세 가격)은 제공하지 않습니다.
        

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumbers | query | O | array | 단지번호 |
| cpList | query | O | array | CP (정렬 순서 그대로 반환) [kab(한국부동산원), kbstar(KB부동산), neo |

**응답 상태**: 성공(200)

---

### 15-3. 단지의 호별 시세 존재하는 여부 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/ho/market-price/exist`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |

**응답 상태**: 성공(200)

---

### 15-4. 단지/동/호 기준 시세 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/building/{buildingNumber}/ho/{hoNumber}/market-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| buildingNumber | path | O | integer | 동 번호 |
| hoNumber | path | O | integer | 호 번호 |

**응답 상태**: 성공(200)

---

### 15-5. 단지 최근 시세 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/market-price/recent`

**설명**: 
            | 타 서비스 제공용
            | - realtors(제공처)와 monthlyRentPrice(월세 가격)은 제공하지 않습니다.
        

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| realEstateType | query | O | string | 부동산 타입 |
| cpList | query | O | array | CP (정렬 순서 그대로 반환) [kab(한국부동산원), kbstar(KB부동산), neo |

**응답 상태**: 성공(200)

---

### 15-6. 시세 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/market-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | path | O | integer | 평형번호 |
| realEstateType | query | O | string | 부동산 타입 |
| cpList | query | O | array | CP (앞에 있는걸 우선시 함) [kab(한국부동산원), kbstar(KB부동산), neo |
| startDate | query | O | string | 조회 시작일자 |
| endDate | query | O | string | 조회 종료일자 |

**응답 상태**: 성공(200)

---

### 15-7. 최근 시세 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/market-price/recent`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | path | O | integer | 평형번호 |
| realEstateType | query | O | string | 부동산 타입 |
| cpList | query | O | array | CP (정렬 순서 그대로 반환) [kab(한국부동산원), kbstar(KB부동산), neo |

**응답 상태**: 성공(200)

---

## 16. 실거래가 랭킹 조회 API (3개 API)

### 16-1. 실거래가 랭킹 cache 초기화

**HTTP 메소드**: `GET`

**URL**: `/complex/real-price/ranking/invalid`

**응답 상태**: 성공(200)

---

### 16-2. 최고 상승/하락 랭킹 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/real-price/ranking/price-gap`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| legalDivisionNumber | query | X | string | 시/군/구 법정동 코드 |
| rankingMonthType | query | O | string | 기간 선택 코드 |
| rankingSortType | query | O | string | 상승/하락 유형 |
| rankingTradeType | query | O | string | 거래 타입 |

**응답 상태**: 성공(200)

---

### 16-3. 아파트 거래량 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/real-price/ranking/trade-quantity`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| legalDivisionNumber | query | X | string | 시/군/구 법정동 코드 |
| rankingMonthType | query | O | string | 기간 선택 코드 |
| rankingTradeType | query | O | string | 거래 타입 |

**응답 상태**: 성공(200)

---

## 17. 실거래가 조회 API 컨트롤러 (4개 API)

### 17-1. 실거래가 페이지 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/real-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | path | O | integer | 평형번호 |
| tradeType | query | O | string | 거래 타입 |
| param | query | O | - | - |

**응답 상태**: 성공(200)

---

### 17-2. 실거래가 리스트 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/real-price/list`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | path | O | integer | 평형번호 |
| tradeType | query | O | string | 거래 타입 |
| startDate | query | O | string | 조회 시작일자 |
| endDate | query | O | string | 조회 종료일자 |

**응답 상태**: 성공(200)

---

### 17-3. 실거래가 요약 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/real-price/summary`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평형 번호 |
| tradeType | query | O | string | 거래 타입 |
| startDate | query | X | string | 조회 시작일 |

**응답 상태**: 성공(200)

---

### 17-4. 실거래가 년도 개수 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/year/{tradeYear}/real-price/count`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지번호 |
| pyeongTypeNumber | path | O | integer | 평형번호 |
| tradeType | query | O | string | 거래 타입 |
| tradeYear | path | O | string | 조회 년도 |

**응답 상태**: 성공(200)

---

## 18. 아파트 단지 조회 수 (3개 API)

### 18-1. 단지 지금인기 랭킹 목록 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/view/rankings`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| size | query | X | integer | 조회 수 |
| viewCountType | query | X | string | 조회 유형 [COMPLEX(단지조회), PRESALE(분양단지조회)] |

**응답 상태**: 성공(200)

---

### 18-2. 단지 급상승 랭킹 목록 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/view/rising/rankings`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| size | query | X | integer | 조회 수 |

**응답 상태**: 성공(200)

---

### 18-3. 단지 조회 수 증가

**HTTP 메소드**: `PUT`

**URL**: `/complex/{complexNumber}/view`

**설명**: 호출 시 NNB 또는 NID_AUTH cookie 필요

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| userChannelType | query | X | string | 사용자채널타입 |

**응답 상태**: 성공(200)

---

## 19. 유저 단지 정보 API(주택담보대출 관련) - deprecated. favorite, my-house 모듈 참조 (3개 API)

### 19-1. 관심 매물 조회(주택담보대출 관련)

**HTTP 메소드**: `GET`

**URL**: `/complex/user/deal/favorite/article/{naverId}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| naverId | path | O | string | 네이버 아이디 |
| realEstateTypes | query | O | array | 부동산 타입 리스트 [A01(APARTMENT), A02(OFFICETEL), A04(RE |

**응답 상태**: 성공(200)

---

### 19-2. 관심 단지 조회(주택담보대출 관련)

**HTTP 메소드**: `GET`

**URL**: `/complex/user/deal/favorite/complex/{naverId}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| naverId | path | O | string | 네이버 아이디 |
| realEstateTypes | query | O | array | 부동산 타입 리스트 [A01(APARTMENT), A02(OFFICETEL), A04(RE |

**응답 상태**: 성공(200)

---

### 19-3. 우리집 단지 조회(주택담보대출 관련)

**HTTP 메소드**: `GET`

**URL**: `/complex/user/deal/my-house/{naverId}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| naverId | path | O | string | 네이버 아이디 |
| realEstateTypes | query | O | array | 부동산 타입 리스트 [A01(APARTMENT), A02(OFFICETEL), A04(RE |

**응답 상태**: 성공(200)

---

## 20. 재개발 (1개 API)

### 20-1. 재개발 구역 정보 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/redevelopment/{redevelopmentAreaNumber}`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| redevelopmentAreaNumber | path | O | integer | 재개발 구역 번호 |

**응답 상태**: 성공(200)

---

## 21. 평당가 API (2개 API)

### 21-1. 지역 평당가 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/legal-division/{legalDivisionNumber}/pyeong-price/kb`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| legalDivisionNumber | path | O | string | 법정동 번호 |

**응답 상태**: 성공(200)

---

### 21-2. 단지 평당가 조회

**HTTP 메소드**: `GET`

**URL**: `/complex/{complexNumber}/pyeong/{pyeongTypeNumber}/pyeong-price`

**파라미터**:

| 파라미터 | 위치 | 필수 | 타입 | 설명 |
|---------|------|------|------|------|
| complexNumber | path | O | integer | 단지 번호 |
| pyeongTypeNumber | path | O | integer | 평 타입 번호 |
| tradeType | query | O | string | 거래 타입 |
| realEstateTypes | query | O | array | 부동산 타입 리스트(A01만 현재 스펙상 사용 필요) [A01(APARTMENT), A02 |

**응답 상태**: 성공(200)

---


---

## 사용 예시

### 예시 1: 특정 단지의 정보 조회
```
GET /complex/{complexNumber}

파라미터:
- complexNumber: 2000000001 (단지 번호)

응답:
- 단지 이름
- 위치 정보
- 건설사
- 준공년도
- 등등
```

### 예시 2: 단지 조회 수 증가
```
PUT /complex/{complexNumber}/view

파라미터:
- complexNumber: 2000000001 (path)
- userChannelType: MOBILE (query, 선택)

효과:
- 해당 단지의 조회수가 1 증가합니다
```

### 예시 3: 단지 투어 정보 추가
```
POST /complex/{complexNumber}/tour

파라미터:
- complexNumber: 2000000001 (path)
- (body에 투어 정보 데이터)

효과:
- 새로운 투어 정보가 등록됩니다
```

---

## 주의사항

1. **인증 필요**: 대부분의 API는 NNB 또는 NID_AUTH 쿠키가 필요합니다
2. **개발 환경**: 현재 URL은 개발 서버입니다 (dev.io.naver.com)
3. **Rate Limiting**: 과도한 요청은 제한될 수 있습니다
4. **API 버전**: v0이므로 향후 변경될 수 있습니다

---

## 참고

- **OpenAPI 버전**: 3.1.0
- **생성일**: 2024년
- **문서 작성**: 초보자 대상

이 문서가 도움이 되길 바랍니다!

