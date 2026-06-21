# Mugnee Fashion Store

A premium fashion ecommerce frontend built with Next.js 15, TypeScript, Tailwind CSS, Zustand, React Hook Form, and Zod.

Mugnee is currently frontend-only, but the codebase is structured around service layers, typed stores, and route architecture so a real backend can be connected later with minimal refactoring.

## Features

- Luxury ecommerce homepage with editorial hero, category edits, campaign tiles, shop-the-look, journal, newsletter, and responsive animations.
- Product catalog with URL-synced filters, active filter chips, search, sorting, price filtering, and shareable filter URLs.
- Product cards with color swatches, hover image swap, wishlist animation, quick view, inventory states, and add-to-cart micro interactions.
- Product detail pages with gallery, thumbnails, fullscreen viewer, hover zoom, swipe support, variant image mapping, related products, and recently viewed products.
- User-scoped cart and wishlist persistence using Zustand persist.
- Premium checkout flow with shipping, billing, review, success state, validation, persisted checkout state, and backend-ready service layer.
- Authentication architecture with login, register, forgot password, profile, mock service layer, persisted auth state, and profile dropdown.
- Admin dashboard architecture and pages for dashboard, products, categories, orders, customers, reviews, coupons, blogs, and settings.
- Centralized currency formatting for BDT.
- Accessible dialogs, keyboard-friendly modal behavior, focus management, loading states, empty states, and skeleton loaders.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Zod
- Framer Motion
- GSAP
- Radix UI
- Lucide React

## Project Structure

```txt
src/
  app/              App Router pages and route layouts
  components/       Reusable UI, commerce, auth, checkout, admin, and layout components
  data/             Mock product, image, blog, and category data
  hooks/            Shared client hooks
  lib/              Utilities, filters, currency helpers, and API client
  sections/         Homepage and marketing sections
  services/         Backend-ready service layer
  store/            Zustand stores
  types/            Shared TypeScript types
  utils/            Additional utilities
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run Next.js lint
```

## Main Routes

- `/` - Homepage
- `/shop` - Product listing and filters
- `/product/[slug]` - Product details
- `/cart` - Cart
- `/checkout` - Checkout flow
- `/checkout/success` - Order success
- `/wishlist` - Wishlist
- `/login` - Login
- `/register` - Register
- `/forgot-password` - Forgot password
- `/profile` - User profile
- `/blog` - Journal
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Admin products
- `/admin/orders` - Admin orders

## Frontend-Only Backend Strategy

The project uses mock responses today, but API-facing code is isolated in `src/services` and `src/lib/api.ts`.

Future backend integration should mainly involve replacing the mock behavior or API base URL inside the service layer.

Expected future endpoints include:

```txt
POST /auth/login
POST /auth/register
GET  /users/:id/cart
POST /users/:id/cart
GET  /users/:id/wishlist
POST /users/:id/wishlist
POST /checkout/orders
```

## State Persistence

Zustand persist is used for:

- Auth session
- User-scoped cart
- User-scoped wishlist
- Checkout state
- Recently viewed products
- Admin-created storefront products

Cart and wishlist data are stored separately per user so one user's data does not appear for another user.

## Notes

- This repository currently uses mock ecommerce data and mock service responses.
- Product images are loaded from Unsplash through `next/image`.
- Admin authentication and role behavior are frontend-only mocks and should be replaced by backend authorization before production use.

