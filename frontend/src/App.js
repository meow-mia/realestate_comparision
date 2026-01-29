import React, { useState } from 'react';
import './App.css';
import ComparisonForm from './components/ComparisonForm';
import ComparisonChart from './components/ComparisonChart';

function App() {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(10); // 기본 10년

  const handleCompare = async (data) => {
    setLoading(true);
    setComparisonData(data);
    setLoading(false);
  };

  const handlePeriodChange = (years) => {
    setPeriod(years);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>부동산 실거래가 비교</h1>
          <p className="subtitle">두 아파트의 실거래가 변화를 비교해보세요</p>
        </div>
      </header>

      <main className="App-main">
        <ComparisonForm
          onCompare={handleCompare}
          period={period}
          onPeriodChange={handlePeriodChange}
        />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        )}

        {comparisonData && !loading && (
          <ComparisonChart
            data={comparisonData}
            period={period}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>실거래가 데이터는 네이버 부동산 API를 기반으로 제공됩니다</p>
      </footer>
    </div>
  );
}

export default App;
