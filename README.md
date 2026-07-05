# NizamProperty

Buy/sell real estate platform for **Nizamabad** and nearby areas.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | ASP.NET Core Web API (C#) |
| Storage | Firebase Firestore + Storage |
| Auth | Firebase Auth (Google + Phone OTP) |
| i18n | English / Telugu toggle |

All app data (profiles, listings, messages, support tickets) is stored in **Firebase** — no browser localStorage for data.

Phone login uses **Firebase Phone Auth**. Real SMS OTP requires the **Blaze (pay-as-you-go)** plan in Firebase Console → Usage and billing.

**Already configured in this project:**
- Phone provider enabled
- India (`IN`) allowed for SMS
- Authorized domains: localhost, `nizamabad-698d9.web.app`, `indur.site`, etc.

**Test without SMS (free):** In [Firebase Console → Authentication → Sign-in method → Phone](https://console.firebase.google.com/project/nizamabad-698d9/authentication/providers), use test numbers e.g. `+919505442525` → OTP `123456`.

```bash
# Re-apply SMS region + auth domains if needed
node scripts/configure-phone-auth.mjs
```

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

### Backend (optional — 99acres import & Twilio OTP API)

```bash
cd backend
dotnet run
```

API: http://localhost:5000 — Swagger at `/swagger`

Health check: `GET /api/health`

## Firebase (Nizamabad)

Connected to Firebase project **`nizamabad-698d9`**.

### Firestore collections

| Collection | Document ID | Purpose |
|---|---|---|
| `profiles` | Firebase Auth `uid` | User name, email, phone, location, saved listing IDs |
| `listings` | Auto-generated | Property listings |
| `conversations` | Auto-generated | Chat threads (buyer ↔ seller) |
| `tickets` | Auto-generated | Support tickets |
| `publicProfiles` | Firebase Auth `uid` | Public name/photo for sellers |
| `serviceCategories` | Service slug (e.g. `plumber`) | Local service types (packers, electrician, etc.) |
| `serviceProviders` | Auto-generated | Verified providers per service category |

### Storage paths

| Path | Purpose |
|---|---|
| `profiles/{userId}/avatar.*` | Profile photo |
| `listings/{listingId}/{filename}` | Listing photos |

**One-time setup:** Enable [Firebase Storage](https://console.firebase.google.com/project/nizamabad-698d9/storage) in the console (click **Get Started**), then deploy storage rules:

```bash
npx firebase-tools@13.35.1 deploy --only storage --project nizamabad-698d9
```

```bash
# CLI (uses sumanthreddyaleti@gmail.com account)
npx firebase-tools@13.35.1 use nizamabad-698d9
npx firebase-tools@13.35.1 apps:list WEB --project nizamabad-698d9
```

Frontend config lives in `frontend/.env` (copy from `frontend/.env.example`). For Vercel, add the same `VITE_FIREBASE_*` variables in the project settings.

### Firebase Hosting

The site is configured for **Firebase Hosting** (classic). Build output is `frontend/dist`.

```bash
# Deploy hosting + Firestore rules/indexes
npx -y firebase-tools@latest deploy --only hosting,firestore --project nizamabad-698d9
```

Live URLs: `https://nizamabad-698d9.web.app` and `https://nizamabad-698d9.firebaseapp.com`

Seed local services collections (requires `gcloud auth login`):

```bash
node scripts/seed-local-services.mjs
```

**Before Google sign-in works:**

1. In [Firebase Console → Authentication → Sign-in method](https://console.firebase.google.com/project/nizamabad-698d9/authentication/providers), enable **Google**.
2. Under **Authorized domains**, add your Vercel domain when you deploy (e.g. `your-app.vercel.app`). `localhost` is already allowed for local dev.

## Project structure

```
frontend/src/
  pages/          # All 7 screens + sub-pages
  components/     # PropertyCard, Layout, LanguageToggle
  i18n/           # EN + Telugu translations
  services/       # Firebase data layer + formatters
  data/constants.js

backend/
  Models/         # User, Property, Conversation, SupportTicket
  Services/       # LocalDataStore (JSON — legacy API only)
  Controllers/    # REST API endpoints
```

## Login

- **Google**: Firebase Google sign-in
- **Phone**: Firebase Phone Auth (SMS OTP via Firebase — enable Phone provider in console)

## Telugu

Use the **తెలుగు / English** button in the header to switch languages.
