# Yedent Agro Website

Website for [Yedent Agro Group of Companies Ltd.](https://example.com) built from the source documents in this repository (`Yedent - About.pdf`, `Pages.pdf`, `Instructions.pdf`).

## Architecture

| Layer | Tech | Folder |
|-------|------|--------|
| Frontend (public site + admin portal) | Next.js (App Router), React, Tailwind CSS, TypeScript | `frontend/` |
| Backend API | Node.js, Express | `backend/` |
| Database | PostgreSQL 17 | `yedent` database |

## Prerequisites

- Node.js (v18+)
- PostgreSQL 17 (running on localhost:5432)

## Backend Setup

```bash
cd backend
npm install

# Configure database credentials
# Copy .env.example to .env and edit DATABASE_URL / JWT_SECRET
cp .env.example .env

# Create db, run schema, and load seed data (idempotent - safe to re-run)
npm run setup-db

# Start the dev server (port 5000)
npm run dev
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health + DB connection check |
| GET | `/api/subsidiaries` | Subsidiaries (`?all=true` includes drafts, auth required) |
| GET | `/api/products` | Products (filter by `?sector=` / `?subsidiary=`, `?all=true` for drafts) |
| GET | `/api/products/:id` | Product with nutrition, images, prep steps, videos |
| GET | `/api/departments` | Departments & heads |
| GET | `/api/sales-reps` | Sales representatives directory |
| GET | `/api/awards` | Awards & recognition |
| GET/PUT | `/api/settings` | Site-wide global config (PUT requires auth) |
| GET | `/api/hero-slides` | Hero carousel slides (`?all=true` for drafts) |
| GET | `/api/news` | News & events (`?all=true` for drafts) |
| POST/PUT/DELETE | all content routes | Write operations require a JWT (`Authorization: Bearer <token>`) |
| POST | `/api/upload` | Image upload (auth required), served at `/uploads/<filename>` |
| POST | `/api/auth/login` | JWT login |
| POST | `/api/auth/register` | Group-admin only: create dept/admin users |
| GET/PUT/DELETE | `/api/auth/users` | Group-admin only: user management |

## CMS (Admin Portal)

The custom CMS lives at **http://localhost:3000/admin** and covers every piece of dynamic
content on the site — no hardcoded data:

- **Dashboard** — content overview with counts and quick actions.
- **Products** — full catalog editor with image gallery, nutrition tables (macro/micro),
  ordered preparation steps, and videos.
- **Subsidiaries, Departments, Sales Reps, Awards, Hero Slides, News & Events** — full CRUD
  with draft/published toggles.
- **Site Settings** — company info, vision/mission, contact details, footer data.
- **Users** — create, edit, activate/deactivate, and reset passwords (group admin only).
- **Image uploads** — every image field has an upload button (stored in `backend/uploads/`).

### Default admin login

After running `npm run setup-db`, a default administrator is created:

```
Email:    admin@yedentghana.com
Password: admin123
```

> **Security:** change this password after first login (Users page → edit → new password),
> and set a strong `JWT_SECRET` in `backend/.env` before deploying.

To create additional admins from the CLI instead:

```bash
cd backend
node scripts/create-admin.js you@example.com YourPass123 --role group_admin
```

### Database Schema

Core tables: `users`, `subsidiaries`, `departments`, `products`, `product_images`, `product_nutrition`, `product_preparation_steps`, `sales_representatives`, `awards`, `site_settings`.

- `products` are grouped under subsidiaries and tagged by `sector` (`consumer`, `industrial`, `poultry_feed`).
- Product nutrition is stored as ordered key-value pairs (`macro`/`micro`), and preparation steps are ordered.

All dynamic content (product details, sales reps, awards, global settings) is CMS-manageable — no hardcoded frontend data.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

## Seed Content

Seeded from the source PDFs:

- **Consumer foods**: Tomvita X, Koko Plus, Maisoyforte (Tombrown) — full nutrition tables, ingredients, prep steps, storage, FDA numbers, allergens.
- **Industrial bulk**: Maize Grit, Extruded Full Fat Soya, Soya Bean Meal, Maize Bran.
- **Poultry feed** (Naple Betta Farms): Broiler & Layer lines (Starters, Growers, Finishers, Concentrates, Phase I/II, etc.).
- **Sales representatives**: 6 reps across Bono, Bono East, and Ashanti regions.
- **Awards**: AGI / GRA / Stanford Seed recognitions (2021–2023).
- **Departments & heads, vision, mission, CSR, contact info**.
