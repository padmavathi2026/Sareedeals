@echo off
echo Reading deals_data.xlsx...
python scripts/xlsx_to_json.py
echo.
echo Clearing cache...
rmdir /s /q node_modules\.vite 2>nul
echo.
echo Starting website...
npm run dev
pause
