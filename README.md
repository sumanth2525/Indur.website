# NizamProperty

Buy/sell real estate platform for **Nizamabad** and nearby areas.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | ASP.NET Core Web API (C#) |
| Storage (MVP) | Browser `localStorage` + backend JSON files |
| i18n | English / Telugu toggle |

Firebase can replace local storage when you're ready.

## Screens

1. **Login** — Google or Phone OTP (demo OTP: `123456`)
2. **Home** — Location filter, Buy/Sell, property feed, FAB
3. **Property Detail** — Carousel, specs, contact seller
4. **Post Ad** — Multi-step seller form
5. **Messages** — Chat threads
6. **Profile** — Stats, listings, saved, support
7. **Support** — FAQ, chat, raise ticket

## Responsive layout

- **Mobile** (< 1024px): App-style UI with bottom nav + floating Post button
- **Desktop** (≥ 1024px): Dashboard with sidebar, stats cards, property grid

## Run locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Backend (optional — frontend uses localStorage by default)

```bash
cd backend
dotnet run
```

API: http://localhost:5000 — Swagger at `/swagger`

Health check: `GET /api/health`

## Project structure

```
frontend/src/
  pages/          # All 7 screens + sub-pages
  components/     # PropertyCard, Layout, LanguageToggle
  i18n/           # EN + Telugu translations
  services/       # localStorage helpers
  data/seed.js    # Demo data + CRUD

backend/
  Models/         # User, Property, Conversation, SupportTicket
  Services/       # LocalDataStore (JSON files in Data/)
  Controllers/    # REST API endpoints
```

## Demo login

- **Google**: Click "Continue with Google" (instant demo login)
- **Phone**: Enter any 10-digit number → OTP `123456`

## Telugu

Use the **తెలుగు / English** button in the header to switch languages.
