# Weather Analytics Dashboard

Minimal React + Redux Toolkit dashboard demonstrating:
- Current weather cards
- 5-day and hourly forecasts
- Search with geocoding autocomplete
- Favorites persisted to localStorage
- Charts using Recharts

Quick start (PowerShell):

```powershell
cd path\to\whetherapp
npm install
# create .env from .env.example and set VITE_OWM_API_KEY
npm run dev
```

Notes:
- This project expects an OpenWeatherMap API key. See `.env.example`.
- Caching is implemented in `src/api/weatherApi.js` to avoid excessive API calls.
# Weather-Analytics-Dashboard
