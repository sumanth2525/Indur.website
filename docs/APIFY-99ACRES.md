# Apify — import 99acres listings

NizamProperty can pull live listings from [99acres](https://www.99acres.com) using the Apify actor **`fatihtahta/99acres-scraper`**.

> **Note:** This actor uses `location` + `deal_type` — **not** `startUrls`.

## 1. Get an Apify token

1. Sign up at [apify.com](https://apify.com)
2. Copy your API token from **Settings → Integrations**

## 2. Configure the backend

```powershell
# Windows — run before dotnet run
$env:APIFY_TOKEN = "apify_api_xxxxxxxx"

cd backend
dotnet run
```

Or set in `backend/appsettings.Development.json`:

```json
{
  "Apify": {
    "Token": "apify_api_xxxxxxxx"
  }
}
```

**Never commit your token to git.**

## 3. curl (direct Apify call)

**For sale — Nizamabad:**

```bash
curl -X POST "https://api.apify.com/v2/acts/fatihtahta~99acres-scraper/run-sync-get-dataset-items?token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"location\":[\"Nizamabad\"],\"deal_type\":\"residential_sale\",\"with_photo\":true,\"limit\":30}"
```

**For rent — Nizamabad:**

```bash
curl -X POST "https://api.apify.com/v2/acts/fatihtahta~99acres-scraper/run-sync-get-dataset-items?token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"location\":[\"Nizamabad\"],\"deal_type\":\"residential_rent\",\"with_photo\":true,\"limit\":30}"
```

Actor slug in URL uses `~` instead of `/`: `fatihtahta~99acres-scraper`

## 4. Via NizamProperty API

With backend running and token set:

```bash
curl -X POST "http://localhost:5000/api/import/99acres" \
  -H "Content-Type: application/json" \
  -d "{\"location\":\"Nizamabad\",\"purpose\":\"sell\",\"limit\":30}"
```

Check status:

```bash
curl http://localhost:5000/api/import/99acres/status
```

## 5. In the app

On **Home**, use **Import from 99acres** (below filters). It uses the current **location** and **For Sale / For Rent** selection.

Requires:
- Backend running (`dotnet run` in `backend/`)
- Frontend dev proxy (`npm run dev` — proxies `/api` to port 5000)
- `APIFY_TOKEN` configured

Imported listings are merged into localStorage with IDs like `99acres-{record_id}`.
