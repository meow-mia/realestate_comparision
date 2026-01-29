from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

app = Flask(__name__)
CORS(app)

BASE_URL = "https://realestate-be-dev.io.naver.com"

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Real Estate Comparison API',
        'endpoints': {
            '/api/search/autocomplete': 'Search apartments',
            '/api/complex/<id>': 'Get complex info',
            '/api/complex/<id>/pyeong-types': 'Get pyeong types',
            '/api/real-price': 'Get real price data',
            '/health': 'Health check'
        }
    })

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
        building_url = f"{BASE_URL}/complex/{complex_number}/building/pyeong"
        headers = {'accept': '*/*'}

        building_response = requests.get(building_url, headers=headers)
        building_data = building_response.json()

        if not building_data.get('data') or not building_data['data'].get('list'):
            return jsonify({'error': 'No pyeong type data available'}), 404

        pyeong_list = building_data['data']['list']
        pyeong_types = []

        for pyeong in pyeong_list:
            pyeong_number = pyeong.get('pyeongTypeNumber')
            if pyeong_number:
                try:
                    detail_url = f"{BASE_URL}/complex/{complex_number}/pyeong-type/{pyeong_number}"
                    detail_response = requests.get(detail_url, headers=headers)
                    detail_data = detail_response.json()

                    if detail_data.get('data'):
                        pyeong_detail = detail_data['data']
                        pyeong_types.append({
                            'pyeongTypeNumber': pyeong_number,
                            'pyeongName': pyeong_detail.get('pyeongName', ''),
                            'supplyArea': pyeong_detail.get('supplyArea', '')
                        })
                except Exception as e:
                    print(f"Error fetching detail for pyeong {pyeong_number}: {e}")
                    continue

        return jsonify({'pyeongTypeList': pyeong_types})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def process_real_price_data(data, years):
    """실거래가 데이터 처리"""
    end_date = datetime.now()
    start_date = end_date - relativedelta(years=years)

    monthly_data = {}

    for item in data:
        trade_date = item.get('tradeDateString', '')
        price = item.get('dealPrice', 0)

        if not trade_date or not price:
            continue

        if '-' in trade_date:
            parts = trade_date.split('-')
            year = parts[0][-2:]
            month = parts[1].zfill(2)
        else:
            if len(trade_date) >= 4:
                year = trade_date[:2]
                month = trade_date[2:4].zfill(2)
            else:
                continue

        year_month = f"{year}{month}"

        if year_month not in monthly_data:
            monthly_data[year_month] = {
                'prices': [],
                'count': 0
            }

        monthly_data[year_month]['prices'].append(price)
        monthly_data[year_month]['count'] += 1

    result = []
    for year_month in sorted(monthly_data.keys()):
        prices = monthly_data[year_month]['prices']
        result.append({
            'yearMonth': year_month,
            'avgPrice': sum(prices) / len(prices),
            'minPrice': min(prices),
            'maxPrice': max(prices),
            'count': monthly_data[year_month]['count']
        })

    return result


@app.route('/api/real-price', methods=['GET'])
def get_real_price():
    """실거래가 조회 API"""
    complex_number = request.args.get('complexNumber')
    pyeong_type_number = request.args.get('pyeongTypeNumber')
    trade_type = request.args.get('tradeType', 'A1')
    years = int(request.args.get('years', 3))

    if not complex_number or not pyeong_type_number:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        url = f"{BASE_URL}/complex/{complex_number}/deal/trade/real-price"
        params = {
            'pyeongTypeNumber': pyeong_type_number,
            'tradeType': trade_type
        }
        headers = {'accept': '*/*'}

        response = requests.get(url, params=params, headers=headers)
        data = response.json()

        if data.get('code') == 'success' and 'data' in data:
            real_price_data = data['data']
            processed_data = process_real_price_data(real_price_data, years)
            return jsonify({
                'data': processed_data,
                'code': 'success'
            })
        else:
            return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """헬스 체크 API"""
    return jsonify({'status': 'healthy', 'message': 'Real Estate Comparison API is running'})


# Vercel serverless function handler
app = app
