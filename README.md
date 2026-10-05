# DemoTest Cannabis Co. — Full-Stack Demo

A full-stack demo project for a fictional Pennsylvania medical cannabis dispensary website.

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express.js (strict MVC pattern)
- **Database:** MySQL (schema + seed data)
- **Auth:** JWT + Role-Based Access Control (RBAC)
- **Dutchie:** Real embed URL used as primary source; mock fallback shown only if embedding is blocked
- **Brand:** DemoTest Cannabis Co. (demo brand)

> **DEMO ONLY.** No orders, no checkout, no real products, no real emails are involved.

---

## Prerequisites

- Node.js 18+ (with `node --watch`)
- MySQL 8+

---

## Setup

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE demotest_cannabis;"

# 2. Load schema
mysql -u root -p demotest_cannabis < backend/schema.sql

# 3. Backend
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

# 4. Frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

---

## Demo Credentials

| Role              | Email                 | Password      |
| ----------------- | --------------------- | ------------- |
| Super Admin       | admin@demotest.test   | Admin123!     |
| Admin             | subadmin@demotest.test| SubAdmin123!  |
| Store Manager     | manager@demotest.test | Manager123!   |
| Marketing Manager | marketing@demotest.test | Market123! |

---

## Features

- **DB-driven homepage** — hero banners + ordered content sections managed in `home_sections` / `hero_banners` and editable from the admin console.
- **DB-driven About page** — `about_sections` with typed renderers (story, mission, values, team, features, community, cta).
- **CMS Pages** — HTML pages managed in the admin (`pages` table), rendered at `/pages/:slug` with publish/draft toggle.
- **Blog** — listing with category and tag filtering (`/blog/category/:cat`, `/blog/tag/:tag`), individual posts with tags + copy-link.
- **Search** — `GET /api/search?q=` across posts, stores, FAQs, careers and pages; UI at `/search`.
- **Rewards tiers** — `/rewards/tiers` with four membership tiers and a perks comparison table.
- **Rewards signup form** — `/rewards#join` membership form (Join Free / 100 welcome points) with full demo submit state; linked from a "Join Us" CTA on `/community`.
- **DB-driven navigation menus** — `menus` / `menu_items` tables power the header, mobile drawer, and footer quick links (served at `GET /api/menus`) and are managed in the admin **Menus** page (add/edit/delete/reorder links, rename/hide menus). Static fallbacks keep the storefront working offline.
- **Location events** — `/locations/events` aggregates upcoming in-store events per location; each store page shows them too.
- **Medical card guide** — `/medical-card` with the FAQ section pulled from the DB.
- **Sitemap & robots** — generated from the DB at `/sitemap.xml` and `/robots.txt`; plus a `/sitemap` page.
- **404 / 500 pages** — on-brand `NotFound` and `ServerError`.
- **Admin console** — dashboard, plus dedicated list + editor pages for Home Page (banners/sections), About, Pages, Stores, Blog, FAQs, Careers, Contact, Users — all CRUD with confirmation dialogs and audit logging.

---

## Deploy to Render

Render hosts the two apps as **separate services** from this one repo, described by `render.yaml` (a Render Blueprint).

> **Render has no MySQL service.** The backend needs an external MySQL host — the free tiers that work are
> **Aiven** (MySQL 8), **TiDB Cloud** (MySQL-compatible) or **Clever Cloud**. Create one first; you only need
> host, port, database, user and password.

### 1. Push the repo

```bash
cd keystone-cannabis-demo
git init
git add .
git commit -m "DemoTest Cannabis Co. — full-stack demo"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`.gitignore` already excludes `.env`, `node_modules` and `dist` — never commit real secrets.

### 2. Create the MySQL database

Run these once against the new database (locally, in any MySQL client) to build the schema and demo data:

```bash
cd backend
# point .env at the hosted DB first
npm run db:schema     # applies schema.sql (idempotent)
npm run seed          # loads demo content (truncates + repopulates)
```

Both are idempotent, so they are also the way to reset a demo database. The Render **Shell** tab on the API
service is the easiest place to re-run them.

### 3. Deploy the Blueprint

Render Dashboard → **New → Blueprint** → select the repo → Render reads `render.yaml` and creates both
services. Fill in every prompted value:

| Service | Var | Value |
| --- | --- | --- |
| `demotest-api` | `DB_HOST` | your MySQL host |
| | `DB_PORT` | `3306` (Aiven may use a custom port) |
| | `DB_NAME` | `demotest_cannabis` |
| | `DB_USER` | your MySQL user |
| | `DB_PASSWORD` | your MySQL password |
| | `DB_SSL` | `true` for most hosted providers |
| | `DB_SSL_CA` | provider CA cert (optional, newlines as `\n`) |
| | `JWT_SECRET` | let Render generate |
| | `CLIENT_URL` | `https://demotest-web.onrender.com` |
| `demotest-web` | `VITE_API_URL` | `https://demotest-api.onrender.com/api` |

Resulting URLs: **frontend** `https://demotest-web.onrender.com` · **API** `https://demotest-api.onrender.com`
(`GET /api/health` returns `{"ok":true}`).

### Deploy notes

- `VITE_*` values are inlined at **build time** — change them, then trigger a new build.
- `CLIENT_URL` must match the frontend origin exactly or browser CORS/login will fail.
- Both apps on `*.onrender.com` are same-site, so the auth cookie stays `SameSite=Lax`; move the frontend to
  another domain and set `COOKIE_SAMESITE=none`.
- Free services **sleep after 15 min idle** and take ~30–60s to wake on the next request.
- Demo credentials are seeded automatically — see the table above.

---

## Dutchie NOTE (important)

The app always uses the real embed URL as its primary source:

```
https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec
```

This URL returns **403 to non-approved domains** and blocks iframe embedding via CSP / `X-Frame-Options`. The app therefore:

1. Always sets this exact URL as the iframe `src` **and** as the "Open in new tab" fallback link.
2. Detects iframe load failure via a **4-second timeout**.
3. If blocked, shows a friendly fallback panel with the real URL link **plus** a **Preview Mode** mock menu, so the demo never looks broken.
4. Never removes or replaces the real URL.

Once Dutchie whitelists your domain, the exact same iframe works with **no code change**.

---

## Folder Structure

```
keystone-cannabis-demo/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/            (User, Role, Store, BlogPost, FAQ, Career, ContactMessage, AuditLog, HomeBanner, HomeSection, AboutSection, Page, Menu, StoreEvent)
│   │   ├── controllers/       (auth, store, blog, faq, career, contact, admin, dutchie, user, home, about, page, search, menu, site)
│   │   ├── routes/            (auth, store, blog, faq, career, contact, admin, dutchie, user, home, about, page, search, menu)
│   │   ├── middleware/        (authMiddleware, rbacMiddleware, errorHandler, rateLimiter, auditLogger)
│   │   ├── utils/             (generateToken, logger)
│   │   ├── data/              (dutchie-products.json, seed.js)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── schema.sql
├── frontend/
│   └── ... (Vite React app)
└── README.md
```

---

## API Endpoints

### Auth
- `POST /api/auth/login` — sets HTTP-only cookie
- `POST /api/auth/logout`
- `GET  /api/auth/me`
- `POST /api/auth/forgot-password` (mock)
- `POST /api/auth/reset-password` (mock)

### Public
- `GET /api/stores`
- `GET /api/stores/:idOrSlug`
- `GET /api/stores/:id/hours`
- `GET /api/stores/:id/events`
- `GET /api/blog`
- `GET /api/blog/:slug`
- `GET /api/faqs`
- `GET /api/careers`
- `GET /api/careers/:id`
- `POST /api/careers/:id/apply` (mock)
- `POST /api/contact` (mock email)

### Home / About / Pages / Menus
- `GET /api/home/banners`
- `GET /api/home/sections`
- `GET /api/about/sections`
- `GET /api/pages`
- `GET /api/pages/:slug`
- `GET /api/menus`

### Search & SEO
- `GET /api/search?q=...`
- `GET /sitemap.xml`
- `GET /robots.txt`

### Dutchie (mock fallback API)
- `GET /api/dutchie/config`
- `GET /api/dutchie/menu/:storeId`
- `GET /api/dutchie/menu/:storeId/:category`
- `GET /api/dutchie/product/:productId`

### Admin (JWT + RBAC)
- `GET  /api/admin/dashboard`
- `GET  /api/admin/home/banners` · `/api/admin/home/banners/:id`
- `POST /api/admin/home/banners` · `PUT /api/admin/home/banners/:id` · `DELETE /api/admin/home/banners/:id`
- `GET  /api/admin/home/sections` · `/api/admin/home/sections/:id`
- `POST /api/admin/home/sections` · `PUT /api/admin/home/sections/:id` · `DELETE /api/admin/home/sections/:id`
- `GET  /api/admin/about` · `/api/admin/about/:id`
- `POST /api/admin/about` · `PUT /api/admin/about/:id` · `DELETE /api/admin/about/:id`
- `GET  /api/admin/pages` · `/api/admin/pages/:id`
- `POST /api/admin/pages` · `PUT /api/admin/pages/:id` · `DELETE /api/admin/pages/:id` · `POST /api/admin/pages/:id/publish`
- `GET  /api/admin/menus` · `/api/admin/menus/:id`
- `POST /api/admin/menus` · `PUT /api/admin/menus/:id` · `DELETE /api/admin/menus/:id`
- `POST /api/admin/menus/:id/items` · `PUT /api/admin/menu-items/:id` · `DELETE /api/admin/menu-items/:id`
- `POST /api/admin/menu-items/:id/move`  (body `{ direction: "up" | "down" }`)
- `GET  /api/admin/stores` · `/api/admin/stores/:id`
- `POST /api/admin/stores` · `PUT /api/admin/stores/:id` · `DELETE /api/admin/stores/:id`
- `GET  /api/admin/blog` · `/api/admin/blog/:id`
- `POST /api/admin/blog` · `PUT /api/admin/blog/:id` · `DELETE /api/admin/blog/:id`
- `GET  /api/admin/faqs` · `/api/admin/faqs/:id`
- `POST /api/admin/faqs` · `PUT /api/admin/faqs/:id` · `DELETE /api/admin/faqs/:id`
- `GET  /api/admin/careers` · `/api/admin/careers/:id`
- `POST /api/admin/careers` · `PUT /api/admin/careers/:id` · `DELETE /api/admin/careers/:id`
- `GET /api/admin/contact` · `DELETE /api/admin/contact/:id`
- `GET /api/admin/users` · `PUT /api/admin/users/:id/status`