# The Roman Estate

A full-stack real estate platform for a premium Mumbai property brand — a public marketing site for browsing listings, and a role-based admin panel for managing everything behind it: properties, blog posts, partner brands, and customer inquiries.

🔗 Live demo: **[roman-estate.vercel.app](https://roman-estate.vercel.app/)** — the public site is open to browse; the `/admin` panel is access-restricted, but you can run the full thing locally (setup below).

![Roman Estate homepage](docs/screenshots/homepage.jpg)

Built with **Next.js 16** (App Router, Turbopack), **TypeScript**, **Tailwind CSS 4**, **MongoDB/Mongoose**, and **Redux Toolkit (RTK Query)**.

## Features

**Public site**
- Home, property listings with filters (type, status, budget, location), and detail pages with an image gallery/lightbox
- Blog with a listing page and individual article pages
- About and Contact pages, with a contact form that lands in the admin inquiries inbox
- Featured properties and partner-brand carousels

**Admin panel** (`/admin`)
- Cookie-based session auth (JWT via `jose`), with a proxy-level guard on all `/admin` routes
- Two roles — `super_admin` and `admin` — with user management restricted to super admins
- CRUD for properties, blog posts, and partner logos, with Cloudinary-backed image uploads
- Inquiry management (status tracking, reply, delete)
- Dashboard with at-a-glance stats

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State/data | Redux Toolkit + RTK Query |
| Database | MongoDB via Mongoose |
| Auth | JWT sessions (`jose`), httpOnly cookies |
| Media | Cloudinary |
| Icons | Lucide |

## Getting Started

**Prerequisites:** Node.js 20+, a MongoDB connection string, and a Cloudinary account.

```bash
git clone https://github.com/kasimbhatkar/Roman-Estate.git
cd Roman-Estate
npm install
cp .env.example .env.local   # then fill in your own values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

### Environment Variables

Copy `.env.example` to `.env.local` and set:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | Secret used to sign admin session JWTs |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap super-admin login (bypasses the database) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (client-side) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary server-side credentials |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── (public)/     # Public site — home, properties, blog, about, contact
│   ├── admin/         # Admin panel pages
│   └── api/           # Route handlers (properties, blogs, partners, users, inquiries, auth, upload)
├── components/         # Shared UI components
├── lib/                # DB connection, session/auth, Cloudinary, Redux store
├── models/             # Mongoose schemas
└── proxy.ts            # Auth guard for /admin routes
```
