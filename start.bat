@echo off
echo ==========================================
echo 부동산 실거래가 비교 서비스 시작
echo ==========================================
echo.

echo [1/2] Backend 서버 시작 중...
start cmd /k "python app.py"

echo [2/2] Frontend 서버 시작 중...
timeout /t 3 /nobreak > nul
cd frontend
start cmd /k "npm start"

echo.
echo ==========================================
echo 서버가 시작되었습니다!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ==========================================
echo.
echo 종료하려면 각 터미널에서 Ctrl+C를 누르세요.
pause
