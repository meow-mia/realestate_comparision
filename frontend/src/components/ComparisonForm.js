import React, { useState } from 'react';
import axios from 'axios';
import './ComparisonForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ComparisonForm = ({ onCompare, period, onPeriodChange }) => {
  const [apartments, setApartments] = useState([
    { name: '', complexNumber: '', pyeongTypeNumber: '', pyeongTypes: [], isSearching: false, isLoadingPyeong: false },
    { name: '', complexNumber: '', pyeongTypeNumber: '', pyeongTypes: [], isSearching: false, isLoadingPyeong: false }
  ]);

  const [searchResults, setSearchResults] = useState([[], [], [], []]);
  const [loading, setLoading] = useState(false);

  // 아파트명 자동완성 검색
  const searchApartment = async (keyword, index) => {
    if (!keyword || keyword.length < 2) {
      const newResults = [...searchResults];
      newResults[index] = [];
      setSearchResults(newResults);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/search/autocomplete`, {
        params: { keyword, size: 5 }
      });

      if (response.data && response.data.data && response.data.data.list) {
        const newResults = [...searchResults];
        newResults[index] = response.data.data.list;
        setSearchResults(newResults);
      }
    } catch (error) {
      console.error('Error searching apartment:', error);
    }
  };

  // 평형 정보 조회
  const fetchPyeongTypes = async (complexNumber, index) => {
    // 로딩 시작
    setApartments(prevApartments => {
      const newApartments = [...prevApartments];
      newApartments[index] = { ...newApartments[index], isLoadingPyeong: true };
      return newApartments;
    });

    try {
      const response = await axios.get(`${API_URL}/api/complex/${complexNumber}/pyeong-types`);

      if (response.data && response.data.pyeongTypeList) {
        const pyeongTypes = response.data.pyeongTypeList;
        // 함수형 업데이트를 사용하여 최신 상태 보장
        setApartments(prevApartments => {
          const newApartments = [...prevApartments];
          newApartments[index] = { ...newApartments[index], pyeongTypes, isLoadingPyeong: false };
          return newApartments;
        });
      }
    } catch (error) {
      console.error('Error fetching pyeong types:', error);
      // 에러 발생 시에도 로딩 상태 해제
      setApartments(prevApartments => {
        const newApartments = [...prevApartments];
        newApartments[index] = { ...newApartments[index], isLoadingPyeong: false };
        return newApartments;
      });
    }
  };

  // 아파트 선택
  const handleSelectApartment = (apartment, index) => {
    const complexNumber = apartment.complexNumber;
    const name = apartment.complexName;

    // 검색 결과 먼저 닫기
    const newResults = [...searchResults];
    newResults[index] = [];
    setSearchResults(newResults);

    // 아파트 정보 업데이트
    const newApartments = [...apartments];
    newApartments[index] = {
      ...newApartments[index],
      name,
      complexNumber,
      pyeongTypeNumber: '',
      pyeongTypes: [],
      isSearching: false
    };
    setApartments(newApartments);

    // 평형 정보 조회
    fetchPyeongTypes(complexNumber, index);
  };

  // 아파트 추가
  const handleAddApartment = () => {
    if (apartments.length < 4) {
      setApartments([...apartments, { name: '', complexNumber: '', pyeongTypeNumber: '', pyeongTypes: [], isSearching: false, isLoadingPyeong: false }]);
    }
  };

  // 아파트 제거
  const handleRemoveApartment = (index) => {
    if (apartments.length > 2) {
      const newApartments = apartments.filter((_, i) => i !== index);
      setApartments(newApartments);

      const newResults = searchResults.filter((_, i) => i !== index);
      setSearchResults(newResults);
    }
  };

  // 아파트명 변경
  const handleNameChange = (value, index) => {
    setApartments(prevApartments => {
      const newApartments = [...prevApartments];
      newApartments[index] = {
        ...newApartments[index],
        name: value,
        isSearching: true
      };
      return newApartments;
    });
    searchApartment(value, index);
  };

  // 입력 필드 포커스
  const handleInputFocus = (index) => {
    setApartments(prevApartments => {
      const newApartments = [...prevApartments];
      newApartments[index] = { ...newApartments[index], isSearching: true };
      return newApartments;
    });
  };

  // 입력 필드 블러 (지연 처리로 클릭 이벤트가 먼저 실행되도록)
  const handleInputBlur = (index) => {
    setTimeout(() => {
      setApartments(prevApartments => {
        const newApartments = [...prevApartments];
        newApartments[index] = { ...newApartments[index], isSearching: false };
        return newApartments;
      });

      setSearchResults(prevResults => {
        const newResults = [...prevResults];
        newResults[index] = [];
        return newResults;
      });
    }, 200);
  };

  // 평형 선택
  const handlePyeongChange = (value, index) => {
    setApartments(prevApartments => {
      const newApartments = [...prevApartments];
      newApartments[index] = { ...newApartments[index], pyeongTypeNumber: value };
      return newApartments;
    });
  };

  // 비교 실행
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    for (let i = 0; i < apartments.length; i++) {
      if (!apartments[i].complexNumber || !apartments[i].pyeongTypeNumber) {
        alert(`${i + 1}번째 아파트와 평형을 선택해주세요.`);
        return;
      }
    }

    setLoading(true);

    try {
      // 각 아파트의 실거래가 데이터 조회
      const requests = apartments.map(apt =>
        axios.get(`${API_URL}/api/real-price`, {
          params: {
            complexNumber: apt.complexNumber,
            pyeongTypeNumber: apt.pyeongTypeNumber,
            years: period
          }
        })
      );

      const responses = await Promise.all(requests);

      const comparisonData = {};
      responses.forEach((response, i) => {
        comparisonData[`apartment${i + 1}`] = {
          name: apartments[i].name,
          pyeong: apartments[i].pyeongTypes.find(p => p.pyeongTypeNumber === parseInt(apartments[i].pyeongTypeNumber))?.pyeongName || '',
          data: response.data
        };
      });

      onCompare(comparisonData);
    } catch (error) {
      console.error('Error comparing apartments:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comparison-form">
      <form onSubmit={handleSubmit}>
        <div className="apartments-grid">
          {apartments.map((apt, index) => (
            <div key={index} className="form-group-wrapper">
              <div className="form-group-header">
                <label>{index + 1}번째 아파트</label>
                {apartments.length > 2 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveApartment(index)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="form-group">
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="아파트명 입력"
                    value={apt.name}
                    onChange={(e) => handleNameChange(e.target.value, index)}
                    onFocus={() => handleInputFocus(index)}
                    onBlur={() => handleInputBlur(index)}
                    className="form-input"
                    autoComplete="off"
                  />
                  {apt.isSearching && searchResults[index] && searchResults[index].length > 0 && (
                    <ul className="search-results">
                      {searchResults[index].map((result, resultIndex) => (
                        <li
                          key={resultIndex}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectApartment(result, index);
                          }}
                          className="search-result-item"
                        >
                          <div className="result-name">{result.complexName}</div>
                          <div className="result-address">{result.legalDivisionName}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <select
                  value={apt.pyeongTypeNumber}
                  onChange={(e) => handlePyeongChange(e.target.value, index)}
                  className={`form-select ${apt.isLoadingPyeong ? 'loading' : ''}`}
                  disabled={apt.pyeongTypes.length === 0 || apt.isLoadingPyeong}
                >
                  {apt.isLoadingPyeong ? (
                    <option value="">평형 정보 불러오는 중...</option>
                  ) : (
                    <>
                      <option value="">평형 선택</option>
                      {apt.pyeongTypes.map((pyeong) => (
                        <option key={pyeong.pyeongTypeNumber} value={pyeong.pyeongTypeNumber}>
                          {pyeong.pyeongName} ({pyeong.supplyArea}㎡)
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>

        {apartments.length < 4 && (
          <button type="button" className="add-btn" onClick={handleAddApartment}>
            + 아파트 추가하기 (최대 4개)
          </button>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '비교 중...' : '비교하기'}
        </button>

        <p className="info-text">
          API 호출까지 시간이 걸릴 수 있습니다. 조금 기다려주세요
        </p>
      </form>
    </div>
  );
};

export default ComparisonForm;
