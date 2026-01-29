import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ComparisonChart.css';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  { border: '#00c471', background: 'rgba(0, 196, 113, 0.1)' },
  { border: '#0066ff', background: 'rgba(0, 102, 255, 0.1)' },
  { border: '#ff6b00', background: 'rgba(255, 107, 0, 0.1)' },
  { border: '#d946ef', background: 'rgba(217, 70, 239, 0.1)' }
];

const ComparisonChart = ({ data, period }) => {
  if (!data) {
    return <div className="no-data">비교할 데이터가 없습니다.</div>;
  }

  // 데이터에서 아파트 목록 추출
  const apartments = Object.keys(data)
    .filter(key => key.startsWith('apartment'))
    .map(key => data[key])
    .filter(apt => apt && apt.data);

  if (apartments.length === 0) {
    return <div className="no-data">비교할 데이터가 없습니다.</div>;
  }

  // 데이터 가공
  const processChartData = () => {
    // 모든 기간 합치기
    const allPeriods = new Set();
    apartments.forEach(apt => {
      const aptData = apt.data?.data || [];
      aptData.forEach(d => allPeriods.add(d.period));
    });

    const sortedPeriods = Array.from(allPeriods).sort();

    // 각 아파트의 데이터셋 생성
    const datasets = apartments.map((apt, index) => {
      const aptData = apt.data?.data || [];
      const aptMap = new Map(aptData.map(d => [d.period, d.avgPrice]));
      const prices = sortedPeriods.map(period => aptMap.get(period) || null);

      return {
        label: `${apt.name} ${apt.pyeong}`,
        data: prices,
        borderColor: COLORS[index].border,
        backgroundColor: COLORS[index].background,
        tension: 0,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS[index].border,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        spanGaps: true,
        borderWidth: 2
      };
    });

    return {
      labels: sortedPeriods.map(period => {
        // YYMM 형식을 YY.MM으로 변환
        return `${period.substring(0, 2)}.${period.substring(2)}`;
      }),
      datasets
    };
  };

  const chartData = processChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // 억 단위로 변환
              const eok = Math.floor(context.parsed.y / 100000000);
              const man = Math.floor((context.parsed.y % 100000000) / 10000);
              label += `${eok}억`;
              if (man > 0) {
                label += ` ${man}만원`;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            // 억 단위로 표시
            const eok = Math.floor(value / 100000000);
            return `${eok}억`;
          },
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  };

  // 통계 정보 계산
  const calculateStats = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return null;

    const prices = dataArray.map(d => d.avgPrice).filter(p => p !== null);
    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const latestPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const priceChange = ((latestPrice - firstPrice) / firstPrice * 100).toFixed(2);

    return {
      minPrice,
      maxPrice,
      latestPrice,
      priceChange
    };
  };

  const formatPrice = (price) => {
    const eok = Math.floor(price / 100000000);
    const man = Math.floor((price % 100000000) / 10000);
    return `${eok}억 ${man > 0 ? `${man}만원` : ''}`;
  };

  return (
    <div className="comparison-chart">
      <h2 className="chart-title">실거래가 비교 그래프 (최근 {period}년)</h2>

      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <div className={`stats-container stats-count-${apartments.length}`}>
        {apartments.map((apt, index) => {
          const stats = calculateStats(apt.data?.data);
          if (!stats) return null;

          return (
            <div key={index} className="stats-card">
              <h3 className="stats-title">
                {apt.name} {apt.pyeong}
              </h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">현재가</span>
                  <span className="stat-value">{formatPrice(stats.latestPrice)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">변동률</span>
                  <span className={`stat-value ${parseFloat(stats.priceChange) >= 0 ? 'positive' : 'negative'}`}>
                    {stats.priceChange}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">최고가</span>
                  <span className="stat-value">{formatPrice(stats.maxPrice)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">최저가</span>
                  <span className="stat-value">{formatPrice(stats.minPrice)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 투자 분석 */}
      {apartments.length >= 2 && (
        <div className="analysis-card">
          <h3 className="analysis-title">투자 분석</h3>
          <div className="analysis-content">
            {(() => {
              const statsWithIndex = apartments.map((apt, index) => ({
                index,
                name: apt.name,
                stats: calculateStats(apt.data?.data),
                change: parseFloat(calculateStats(apt.data?.data)?.priceChange || 0)
              })).filter(item => item.stats);

              // 변동률로 정렬
              statsWithIndex.sort((a, b) => b.change - a.change);

              const highest = statsWithIndex[0];
              const lowest = statsWithIndex[statsWithIndex.length - 1];
              const diff = (highest.change - lowest.change).toFixed(2);

              return (
                <p>
                  <strong>{highest.name}</strong>이(가) 가장 높은 상승률({highest.change}%)을 보이고 있으며,
                  <strong> {lowest.name}</strong>과(와)
                  <strong className="highlight"> {diff}%p </strong>
                  차이가 납니다.
                </p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonChart;
