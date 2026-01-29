# 법정동 API 정리 문서

## 개요

이 문서는 네이버 부동산의 **법정동(법정 행정 구역) 관련 API**를 정리한 것입니다. 법정동은 대한민국의 행정 구역을 나타내는 것으로, 시(SI) → 군/구(GUN) → 읍/면(EUP) → 리(LI) 같은 계층 구조를 가지고 있습니다.

이 API들을 사용하면:
- 특정 위치(좌표)의 법정동 정보를 조회할 수 있습니다
- 법정동의 하위 지역 정보를 얻을 수 있습니다
- 지역의 부동산 가격 및 매물 통계를 확인할 수 있습니다
- 인기 지역 랭킹을 볼 수 있습니다

---

## 1. 기본 조회 API

### 1.1 좌표로 법정동 찾기
**API 이름**: 좌표 기반 법정동 검색

**설명**: 경도(가로)와 위도(세로) 좌표를 입력하면 해당 위치의 법정동 정보를 알려줍니다. 예를 들어 "서울시 강남구" 좌표를 입력하면 그 위치의 정확한 법정동 정보를 받을 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/search`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| longitude | 필수 | 경도 (가로 좌표) | 126.9684162 |
| latitude | 필수 | 위도 (세로 좌표) | 37.5641265 |
| type | 선택 | 지역 단계 선택 (SI=시, GUN=군/구, EUP=읍/면, LI=리, ALL=전체) | "EUP" |
| needsPolygon | 선택 | 경계선 정보 포함 여부 | false |

**응답 예시**:
```json
{
  "code": "success",
  "data": {
    "legalDivisionNumber": "1168010800",
    "legalDivisionName": "서울특별시 강남구 역삼동",
    "coordinates": {
      "xCoordinate": 127.03,
      "yCoordinate": 37.50
    }
  }
}
```

---

### 1.2 법정동 번호로 하위 지역 조회
**API 이름**: 법정동 하위 정보 조회

**설명**: 특정 법정동 번호를 입력하면 그 지역의 더 작은 단위의 법정동들을 보여줍니다. 예를 들어 "서울시" 번호를 입력하면 "강남구", "강동구" 같은 구들이 나타납니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/{legalDivisionNumber}`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumber | 필수 | 법정동 번호 | "1100000000" |
| legalDivisionLevelType | 필수 | 어느 단계의 번호인지 (SI, GUN, EUP, LI) | "SI" |

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "legalDivisionNumber": "1111000000",
      "legalDivisionName": "서울특별시 종로구",
      "legalDivisionLevelType": "GUN"
    },
    {
      "legalDivisionNumber": "1114000000",
      "legalDivisionName": "서울특별시 중구",
      "legalDivisionLevelType": "GUN"
    }
  ]
}
```

---

### 1.3 여러 법정동 정보 한번에 조회
**API 이름**: 다중 법정동 정보 조회

**설명**: 여러 개의 법정동 번호를 한 번에 입력하면 각각의 상세 정보를 한꺼번에 받을 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/infos`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumbers | 필수 | 법정동 번호들 (여러 개 가능) | ["1168010800", "1168010900"] |

**응답 예시**:
```json
{
  "code": "success",
  "data": {
    "1168010800": {
      "legalDivisionNumber": "1168010800",
      "legalDivisionName": "서울특별시 강남구 역삼동",
      "cityName": "서울특별시",
      "divisionName": "강남구"
    }
  }
}
```

---

### 1.4 특정 단계 모든 법정동 조회
**API 이름**: 지역 단계별 조회

**설명**: SI(시), GUN(구), EUP(읍) 같은 특정 단계의 모든 법정동 목록을 조회할 수 있습니다. 예를 들어 "시" 단계를 선택하면 한국의 모든 시 목록이 나타납니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/infos/{regionLevelType}`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| regionLevelType | 필수 | 조회할 지역 단계 (SI, GUN, EUP, LI) | "GUN" |

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "legalDivisionNumber": "1111000000",
      "legalDivisionName": "서울특별시 종로구",
      "legalDivisionLevelType": "GUN"
    }
  ]
}
```

---

### 1.5 모든 법정동 조회 (특정 단계까지)
**API 이름**: 전체 법정동 계층 조회

**설명**: 시작점부터 특정 단계까지의 모든 법정동을 계층 구조로 조회합니다. 예를 들어 "리" 단계까지 선택하면, 시 → 구 → 읍 → 리 전체 계층 구조를 받을 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/all-infos`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionLevelType | 필수 | 조회할 최하위 단계 (SI, GUN, EUP, LI) | "EUP" |

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "legalDivisionNumber": "1100000000",
      "legalDivisionName": "서울특별시",
      "childLegalDivisionList": [
        {
          "legalDivisionNumber": "1111000000",
          "legalDivisionName": "서울특별시 종로구"
        }
      ]
    }
  ]
}
```

---

## 2. 지도 조회 API

### 2.1 지도 범위 내 법정동 조회
**API 이름**: 경계박스 기반 법정동 클러스터 검색

**설명**: 지도에서 보이는 범위(좌측, 우측, 상단, 하단)를 입력하면 그 범위 내의 모든 법정동을 반환합니다. 지도를 확대/축소할 때 현재 화면에 보이는 지역들을 조회하고 싶을 때 사용합니다.

**HTTP 메서드**: POST

**URL 경로**: `/legal-division/cluster`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionType | 필수 (쿼리) | 조회할 지역 유형 (SI, GUN, EUP, LI, ALL) | "EUP" |
| boundingBox | 필수 (본문) | 지도 범위 좌표 | 아래 참조 |

**boundingBox 구조**:
```json
{
  "left": 127.0,      // 좌측 경도
  "right": 127.2,     // 우측 경도
  "top": 37.6,        // 상단 위도
  "bottom": 37.55     // 하단 위도
}
```

**요청 본문 예시**:
```json
{
  "boundingBox": {
    "left": 127.0,
    "right": 127.2,
    "top": 37.6,
    "bottom": 37.55
  }
}
```

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "legalDivisionNumber": "1168010800",
      "legalDivisionName": "서울특별시 강남구 역삼동",
      "coordinates": {
        "xCoordinate": 127.03,
        "yCoordinate": 37.50
      }
    }
  ]
}
```

---

## 3. 랭킹 조회 API

### 3.1 지금 인기 있는 지역 랭킹
**API 이름**: 법정동 인기도 랭킹

**설명**: 현재 사용자들이 많이 보고 있는 지역들을 순위 순서로 보여줍니다. "지금 핫한 지역"을 알 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/view/rankings`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| size | 선택 | 가져올 랭킹 개수 | 10 |

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "ranking": 1,
      "type": "CORTAR",
      "viewCount": 15234.5,
      "legalDivisionAddress": "서울시 성동구 왕십리동",
      "coordinates": {
        "xCoordinate": 127.1,
        "yCoordinate": 37.5
      },
      "url": "https://m.land.naver.com/map/37.513583:127.031375:14/"
    }
  ]
}
```

---

### 3.2 급상승 랭킹
**API 이름**: 법정동 급상승 지역 랭킹

**설명**: 조회가 급격히 늘어난 지역들을 보여줍니다. "인기가 급상승한 지역"을 찾을 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/view/rising/rankings`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| size | 선택 | 가져올 랭킹 개수 | 10 |

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "ranking": 1,
      "type": "CORTAR",
      "viewCount": 1234.5,  // 상승 수치
      "legalDivisionAddress": "서울시 강남구 역삼동"
    }
  ]
}
```

---

## 4. 통계 조회 API

### 4.1 주간 평당가 조회
**API 이름**: 지역별 주간 평당가 통계

**설명**: 특정 지역의 부동산 평당 가격을 주(week) 단위로 볼 수 있습니다. 예를 들어 "평형 20평대 아파트의 1주일 평균 가격"을 확인할 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/statistics/{legalDivisionNumber}/pyeong-price/weekly`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumber | 필수 | 법정동 번호 (전국=0000000000) | "1168010800" |
| realEstateTypeCode | 필수 | 부동산 종류 코드 (A01=아파트, A02=오피스텔 등) | "A01" |
| tradeType | 필수 | 거래 종류 (A1=매매, B1=전세) | "A1" |
| pyeongRangeLower | 선택 | 평형 최소값 | 20 |
| pyeongRangeUpper | 선택 | 평형 최대값 | 30 |
| baseDate | 선택 | 기준 날짜 (YYYY-MM-DD 형식) | "2025-01-29" |
| offset | 필수 | 조회 기간 (ISO-8601 형식, 음수만 가능) | "P-1Y" (1년 전까지) |

**부동산 종류 코드**:
- A01: 아파트
- A02: 오피스텔
- A04: 다세대 주택
- B01: 상업 건물
- C01: 땅
- 기타 등등

**응답 예시**:
```json
{
  "code": "success",
  "data": [
    {
      "yearMonth": "2025-01",
      "weekOfMonth": 1,
      "firstDayOfWeek": "2025-01-06",
      "averagePyeongPrice": 5000000  // 평당 가격
    },
    {
      "yearMonth": "2025-01",
      "weekOfMonth": 2,
      "firstDayOfWeek": "2025-01-13",
      "averagePyeongPrice": 5100000
    }
  ]
}
```

---

### 4.2 주간 평당가 평형대 목록
**API 이름**: 주간 평당가 평형 범위 목록

**설명**: 특정 지역에서 주간 평당가 통계에 사용할 수 있는 평형대(평형의 범위)들을 보여줍니다. 예를 들어 "20평, 25평, 30평" 같은 평형대 목록을 얻을 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/statistics/{legalDivisionNumber}/pyeong-price/weekly/pyeong-range-codes`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumber | 필수 | 법정동 번호 | "1168010800" |

**응답 예시**:
```json
{
  "code": "success",
  "data": [20, 25, 30, 35, 40]  // 사용 가능한 평형대
}
```

---

### 4.3 주간 매물량 조회
**API 이름**: 지역별 주간 매물 수량 통계

**설명**: 특정 지역의 등록된 매물 개수를 주(week) 단위로 조회할 수 있습니다. 예를 들어 "지난 1년간 매주 몇 개의 매물이 올라왔는지" 볼 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/statistics/{legalDivisionNumber}/article-count/weekly`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumber | 필수 | 법정동 번호 | "1168010800" |
| realEstateTypeCode | 필수 | 부동산 종류 코드 | "A01" |
| tradeType | 필수 | 거래 종류 (A1=매매, B1=전세, B2=월세 등) | "A1" |
| pyeongRangeLower | 선택 | 평형 최소값 | 20 |
| pyeongRangeUpper | 선택 | 평형 최대값 | 30 |
| baseDate | 선택 | 기준 날짜 | "2025-01-29" |
| offset | 필수 | 조회 기간 | "P-1Y" |

**응답 예시**:
```json
{
  "code": "success",
  "data": {
    "periodAverageCount": 450,  // 조회 기간 평균 매물 수
    "weeklyCounts": [
      {
        "yearMonth": "2025-01",
        "weekOfMonth": 1,
        "firstDayOfWeek": "2025-01-06",
        "averageCount": 420
      },
      {
        "yearMonth": "2025-01",
        "weekOfMonth": 2,
        "firstDayOfWeek": "2025-01-13",
        "averageCount": 480
      }
    ]
  }
}
```

---

### 4.4 주간 매물량 평형대 목록
**API 이름**: 주간 매물량 평형 범위 목록

**설명**: 주간 매물량 통계에 사용할 수 있는 평형대 목록을 보여줍니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/statistics/{legalDivisionNumber}/article-count/weekly/pyeong-range-codes`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumber | 필수 | 법정동 번호 | "1168010800" |

**응답 예시**:
```json
{
  "code": "success",
  "data": [20, 25, 30, 35, 40, 50, 60]
}
```

---

## 5. 조회 수 관리 API

### 5.1 단지 조회 수 증가
**API 이름**: 특정 지역 조회 수 기록

**설명**: 사용자가 특정 지역을 조회했을 때, 그 조회 수를 기록합니다. 이 데이터는 인기도 랭킹을 만드는 데 사용됩니다.

**HTTP 메서드**: PUT

**URL 경로**: `/legal-division/{legalDivisionNumber}/view`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| legalDivisionNumber | 필수 | 법정동 번호 | "1168010800" |
| userChannelType | 선택 | 사용 기기 (MOBILE=모바일, PC=컴퓨터) | "MOBILE" |

**추가 정보**: NNB 또는 NID_AUTH 쿠키가 필요합니다 (사용자 인증).

**응답 예시**:
```json
{
  "code": "success",
  "message": "조회 수가 기록되었습니다."
}
```

---

## 6. 문서 관리 API (관리자 기능)

### 6.1 법정동 문서 생성
**API 이름**: 법정동 정보 문서 저장

**설명**: 시스템 관리자가 새로운 법정동 정보를 데이터베이스에 저장합니다.

**HTTP 메서드**: POST

**URL 경로**: `/legal-division/document`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 |
|---------|---------|------|
| requestBody | 필수 | 법정동 정보 데이터 (JSON) |

---

### 6.2 전체 법정동 일괄 생성
**API 이름**: 모든 법정동 정보 일괄 저장

**설명**: 한국의 모든 법정동 정보를 한 번에 데이터베이스에 저장합니다.

**HTTP 메서드**: POST

**URL 경로**: `/legal-division/document/all`

---

### 6.3 지도 경계선 업데이트
**API 이름**: 법정동 폴리곤(경계선) 업데이트

**설명**: 각 법정동의 지도상 경계선(폴리곤) 정보를 업데이트합니다.

**HTTP 메서드**: PUT

**URL 경로**: `/legal-division/document/polygons`

---

### 6.4 법정동 문서 검색
**API 이름**: 법정동 문서 키워드 검색

**설명**: 특정 키워드로 저장된 법정동 문서를 검색합니다. 예를 들어 "서울" 키워드로 검색하면 서울 관련 모든 법정동 정보를 찾을 수 있습니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/document/search`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| keyWord | 필수 | 검색 키워드 | "서울특별시" |

**응답 예시**:
```json
{
  "code": "success",
  "data": {
    "legalDivisionNumber": "1100000000",
    "legalDivisionName": "서울특별시",
    "legalDivisionLevelType": "SI"
  }
}
```

---

### 6.5 법정동 문서 삭제
**API 이름**: 법정동 정보 문서 삭제

**설명**: 저장된 법정동 정보 문서를 삭제합니다.

**HTTP 메서드**: DELETE

**URL 경로**: `/legal-division/document/{id}`

**필요한 파라미터**:
| 파라미터 | 필수 여부 | 설명 |
|---------|---------|------|
| id | 필수 | 삭제할 문서 ID |

---

### 6.6 캐시 초기화
**API 이름**: 법정동 정보 캐시 무효화

**설명**: 메모리에 저장된 법정동 정보를 새로고침합니다. 데이터를 업데이트한 후 즉시 반영되도록 할 때 사용합니다.

**HTTP 메서드**: GET

**URL 경로**: `/legal-division/invalid`

---

## 7. API 사용 시 주의사항

### 필수 인증 정보
- 일부 조회 API에서는 **NNB 또는 NID_AUTH 쿠키**가 필요할 수 있습니다
- 이는 네이버 회원 인증 정보입니다

### 응답 코드 설명
| 코드 | 의미 |
|------|------|
| success | API 호출 성공 |
| created | 새로운 데이터 생성 성공 |
| bad_request | 잘못된 요청 (파라미터 오류 등) |
| internal_server_error | 서버 오류 |
| error_no_content | 요청한 데이터가 존재하지 않음 |

### 날짜 형식
- **기본 형식**: YYYY-MM-DD (예: 2025-01-29)
- **ISO-8601 기간 형식**: P-1Y (1년 전), P-3M (3개월 전) 등

### 좌표 정보
- **경도**: 좌우 위치 (X축) - 예: 126.9684162
- **위도**: 상하 위치 (Y축) - 예: 37.5641265
- 한국의 좌표는 약 경도 124~132, 위도 33~43 범위입니다

---

## 8. 사용 예시

### 예시 1: 특정 주소의 법정동 찾기
```
요청: GET /legal-division/search?longitude=126.9684162&latitude=37.5641265&type=EUP
응답: 서울시 강남구 역삼동의 상세 정보
```

### 예시 2: 서울시의 모든 구 조회
```
요청: GET /legal-division/1100000000?legalDivisionLevelType=SI
응답: 강남구, 강동구, 종로구 등 서울 하위 지역 목록
```

### 예시 3: 강남구의 최근 1년 평당가 확인
```
요청: GET /legal-division/statistics/1168010000/pyeong-price/weekly?realEstateTypeCode=A01&tradeType=A1&offset=P-1Y
응답: 지난 1년간 매주의 평당 가격 데이터
```

### 예시 4: 현재 핫한 지역 TOP 10
```
요청: GET /legal-division/view/rankings?size=10
응답: 현재 가장 많이 조회되는 지역 10개
```

---

## 마치며

이 API들을 활용하면 부동산 관련 애플리케이션에서 지역 정보를 조회하고, 가격 통계를 분석하며, 인기 지역을 파악할 수 있습니다. 각 API의 파라미터를 올바르게 설정하면 필요한 데이터를 효과적으로 가져올 수 있습니다.

문제가 발생하면 응답 코드를 확인하여 원인을 파악하세요!
