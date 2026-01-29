from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

app = Flask(__name__)
CORS(app)

BASE_URL = "https://realestate-be-dev.io.naver.com"

@app.route('/api/search/autocomplete', methods=['GET'])
def autocomplete():
    """아파트명 자동완성 API"""
    keyword = request.args.get('keyword', '')
    page = request.args.get('page', 1)
    size = request.args.get('size', 10)

    try:
        url = f"{BASE_URL}/search2/home/complexes/autocomplete"
        params = {
            'keyword': keyword,
            'page': page,
            'size': size
        }
        headers = {'accept': '*/*'}

        response = requests.get(url, params=params, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/complex/<int:complex_number>', methods=['GET'])
def get_complex_info(complex_number):
    """단지 정보 조회 API"""
    try:
        url = f"{BASE_URL}/complex/{complex_number}"
        headers = {'accept': '*/*'}

        response = requests.get(url, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/complex/<int:complex_number>/pyeong-types', methods=['GET'])
def get_pyeong_types(complex_number):
    """단지 내 평형 정보 조회 API"""
    try:
        # 1단계: 건물별 평형 번호 목록 조회
        url = f"{BASE_URL}/complex/{complex_number}/building/pyeong"
        headers = {'accept': '*/*'}

        response = requests.get(url, headers=headers)
        building_data = response.json()

        # 평형 번호 중복 제거
        pyeong_numbers = set()
        if building_data.get('code') == 'success' and 'data' in building_data:
            for building in building_data['data']:
                pyeong_numbers.update(building.get('pyeongTypeList', []))

        # 2단계: 각 평형 번호의 상세 정보 조회
        pyeong_list = []
        for pyeong_num in pyeong_numbers:
            try:
                detail_url = f"{BASE_URL}/complex/{complex_number}/pyeong/{pyeong_num}"
                detail_response = requests.get(detail_url, headers=headers)
                detail_data = detail_response.json()

                if detail_data.get('code') == 'success' and 'data' in detail_data:
                    data = detail_data['data']
                    pyeong_list.append({
                        'pyeongTypeNumber': data.get('number'),
                        'pyeongName': data.get('name', ''),
                        'supplyArea': data.get('supplyArea', 0)
                    })
            except Exception as e:
                print(f"Error fetching pyeong {pyeong_num} details: {e}")
                continue

        # 면적 순으로 정렬
        pyeong_list = sorted(pyeong_list, key=lambda x: x['supplyArea'])

        return jsonify({'pyeongTypeList': pyeong_list})
    except Exception as e:
        print(f"Error fetching pyeong types: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/real-price', methods=['GET'])
def get_real_price():
    """실거래가 조회 API"""
    complex_number = request.args.get('complexNumber')
    pyeong_type_number = request.args.get('pyeongTypeNumber')
    trade_type = request.args.get('tradeType', 'A1')  # A1=매매
    period_years = request.args.get('years', 3, type=int)  # 기본 3년

    if not complex_number or not pyeong_type_number:
        return jsonify({'error': 'complexNumber and pyeongTypeNumber are required'}), 400

    try:
        # 날짜 계산 (오늘부터 period_years년 전까지)
        end_date = datetime.now()
        start_date = end_date - relativedelta(years=period_years)

        url = f"{BASE_URL}/complex/{complex_number}/pyeong/{pyeong_type_number}/real-price/list"
        params = {
            'tradeType': trade_type,
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d')
        }
        headers = {'accept': '*/*'}

        response = requests.get(url, params=params, headers=headers)
        data = response.json()

        # 데이터 가공: 월별로 그룹화하고 평균 계산
        # Naver API는 'data' 필드로 거래 목록 반환
        if data.get('code') == 'success' and 'data' in data:
            processed_data = process_real_price_data(data['data'])
            return jsonify({
                'success': True,
                'data': processed_data,
                'raw': data
            })

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def process_real_price_data(transactions):
    """실거래가 데이터를 월별로 그룹화하여 처리"""
    monthly_data = {}

    for transaction in transactions:
        # 거래일을 YYMM 형식으로 변환
        trade_date = transaction.get('tradeDate') or transaction.get('dealDate')
        if not trade_date:
            continue

        # tradeDate 형식: "2024-07-30" -> "2407"
        try:
            if '-' in trade_date:
                # YYYY-MM-DD 형식
                parts = trade_date.split('-')
                year = parts[0][-2:]  # 뒤 2자리
                month = parts[1].zfill(2)
            elif '.' in trade_date:
                # YYYY.MM.DD 형식
                parts = trade_date.split('.')
                year = parts[0][-2:]  # 뒤 2자리
                month = parts[1].zfill(2)
            else:
                # 다른 형식 처리
                year = str(trade_date)[:2]
                month = str(trade_date)[2:4]

            ym_key = f"{year}{month}"

            # 가격 추출
            price = transaction.get('dealPrice') or transaction.get('tradePrice', 0)

            if ym_key not in monthly_data:
                monthly_data[ym_key] = {
                    'prices': [],
                    'transactions': []
                }

            monthly_data[ym_key]['prices'].append(price)
            monthly_data[ym_key]['transactions'].append(transaction)
        except Exception as e:
            print(f"Error processing transaction: {e}")
            continue

    # 월별 평균 계산
    result = []
    for ym_key in sorted(monthly_data.keys()):
        prices = monthly_data[ym_key]['prices']
        result.append({
            'period': ym_key,
            'avgPrice': sum(prices) // len(prices),
            'minPrice': min(prices),
            'maxPrice': max(prices),
            'count': len(prices),
            'transactions': monthly_data[ym_key]['transactions']
        })

    return result


@app.route('/api/compare', methods=['POST'])
def compare_apartments():
    """두 아파트 실거래가 비교 API"""
    data = request.json

    apt1 = data.get('apartment1', {})
    apt2 = data.get('apartment2', {})
    years = data.get('years', 3)

    results = {
        'apartment1': None,
        'apartment2': None,
        'success': True
    }

    # 첫 번째 아파트 데이터 조회
    if apt1.get('complexNumber') and apt1.get('pyeongTypeNumber'):
        try:
            response1 = requests.get(
                f"http://localhost:5000/api/real-price",
                params={
                    'complexNumber': apt1['complexNumber'],
                    'pyeongTypeNumber': apt1['pyeongTypeNumber'],
                    'tradeType': 'A1',
                    'years': years
                }
            )
            results['apartment1'] = response1.json()
        except Exception as e:
            results['apartment1'] = {'error': str(e)}

    # 두 번째 아파트 데이터 조회
    if apt2.get('complexNumber') and apt2.get('pyeongTypeNumber'):
        try:
            response2 = requests.get(
                f"http://localhost:5000/api/real-price",
                params={
                    'complexNumber': apt2['complexNumber'],
                    'pyeongTypeNumber': apt2['pyeongTypeNumber'],
                    'tradeType': 'A1',
                    'years': years
                }
            )
            results['apartment2'] = response2.json()
        except Exception as e:
            results['apartment2'] = {'error': str(e)}

    return jsonify(results)


@app.route('/health', methods=['GET'])
def health_check():
    """헬스 체크 API"""
    return jsonify({'status': 'healthy', 'message': 'Real Estate Comparison API is running'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("Starting Real Estate Comparison API Server...")
    print(f"Server running on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)
