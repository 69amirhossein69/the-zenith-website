# The Zenith — Luxury Cabins Booking (Next.js + Supabase + NextAuth)

An elegant, production-ready hotel/cabin booking website built with the Next.js App Router. It features Google authentication, Supabase-backed data, protected account pages, server actions, dynamic image optimization, and a clean Tailwind CSS 4 design.

![Zenith Logo](./public/logo.png)

## Tech Stack

- Next.js 15 (App Router) — `app/` directory, server components, server actions
- React 19
- Authentication: NextAuth.js v5 (Google provider) in `app/_lib/auth.js` + middleware protection in `middleware.js`
- Database & Storage: Supabase (`app/_lib/supabase.js`, tables: `cabins`, `guests`, `bookings`, `settings`)
- Styling: Tailwind CSS 4 + PostCSS (`app/_styles/globals.css`, `postcss.config.mjs`)
- Images: Next Image with remote patterns configured in `next.config.mjs` to allow Supabase Storage images

## Features

- Home hero with CTA and optimized background image (`app/page.js`)
- Cabins listing and details pages with dynamic routes (`app/cabins/page.js`, `app/cabins/[cabinId]/`)
- Authenticated account area with profile and reservations
  - `app/account/page.js`, `app/account/profile/`, `app/account/reservations/`
- Google sign-in/out via server actions (`signInAction`, `signOutAction` in `app/_lib/actions.js`)
- Create, edit, and delete reservations with robust authorization checks
- Server actions for mutations and `revalidatePath` for instant UI freshness
- Country selector and date picker (`react-day-picker`) with disabled dates from live bookings
- Graceful loading states and error boundaries (`app/loading.js`, `app/not-found.js`, `app/error.js`)

## Project Structure

- `app/`
  - `_components/` reusable UI components (cards, forms, lists, header, nav, etc.)
  - `_lib/` core logic: `auth.js`, `actions.js`, `data-service.js`, `supabase.js`
  - `cabins/` public routes, dynamic `[cabinId]/` and `thankyou/`
  - `account/` protected routes: `profile/`, `reservations/`
  - `api/` route handlers (e.g., NextAuth handler under `app/api/auth/[...nextauth]`)
  - `layout.js`, `page.js`, `loading.js`, `error.js`, `not-found.js`
- `public/` static assets (logo, hero images)
- `middleware.js` protects `/account` via `auth` middleware
- `next.config.mjs` image remote patterns for Supabase storage

## Environment Variables

Create a `.env.local` in the project root with:

```bash
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Google OAuth (NextAuth v5)
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# NextAuth (recommended in production)
NEXTAUTH_SECRET=generate_a_strong_secret
# NEXTAUTH_URL=https://your-deployed-url.example  # set on Vercel prod
```

Notes:
- Update `next.config.mjs` if your Supabase Storage bucket domain differs.
- Ensure Supabase tables exist: `cabins`, `guests`, `bookings`, `settings`.

## Local Development

1) Install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## NPM Scripts

- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run prod` — Build then start
- `npm run lint` — Lint with ESLint (Next core-web-vitals config)

## Data Model (expected)

The app expects the following Supabase tables and minimal columns:

- `cabins`: `id`, `name`, `maxCapacity`, `regularPrice`, `discount`, `image`
- `guests`: `id`, `email`, `fullName`, `nationality`, `countryFlag`, `nationalID`
- `bookings`: `id`, `guestId`, `cabinId`, `startDate`, `endDate`, `numNights`, `numGuests`, `totalPrice`, `status`, `observations`, `isPaid`
- `settings`: project-wide configuration used by `getSettings()`

Image assets may be served from Supabase Storage; ensure the bucket path matches the configured remote pattern.

## Auth & Middleware

- NextAuth is configured in `app/_lib/auth.js` with a Google provider.
- The `middleware.js` uses `auth` to protect `/account` routes.
- Custom sign-in page: `/login` (see `app/login/page.js`).

## Routing Overview

- `/` — Home
- `/cabins` — All cabins
- `/cabins/[cabinId]` — Cabin details + reservation form
- `/cabins/thankyou` — Post-reservation confirmation
- `/account` — Dashboard (protected)
- `/account/profile` — Profile management (protected)
- `/account/reservations` — View/edit/delete reservations (protected)
- `/login` — Sign-in page

## Deployment (Vercel)

1) Push this repo to GitHub.
2) Import to Vercel and select this project.
3) Add required environment variables in Vercel Project Settings (Environment Variables).
4) Build and deploy. On production, set `NEXTAUTH_URL` to your public URL and ensure `NEXTAUTH_SECRET` is set.

Images hosted on Supabase Storage must be publicly accessible, or served via signed URLs with appropriate code changes.

## Troubleshooting

- Auth callback errors: verify `AUTH_GOOGLE_ID/SECRET`, and Google OAuth Authorized redirect URIs set to your domain (`/api/auth/callback/google`).
- 401/Unauthorized on server actions: ensure you’re logged in and that `middleware.js` is active for `/account`.
- Images not loading: confirm `next.config.mjs` `images.remotePatterns` matches your Supabase Storage domain/path.
- Missing data: verify Supabase tables and policies. Console errors in `app/_lib/data-service.js` can hint at misconfigured schemas.

---

