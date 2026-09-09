# CRETE-CHEM — Next.js

Next.js App Router, TypeScript and Tailwind CSS implementation of the supplied CRETE-CHEM guide. MongoDB Atlas stores the catalog, content, images, password-only admin sessions, orders and inspections. Hosted on Vercel.

## Local setup

Use Node.js 22 or 24. Run `npm ci`, copy `.env.example` to `.env.local`, fill the credentials, then run `npm run dev`. Open http://localhost:4174. Administration is at `/admin`; the existing MongoDB password is preserved, with no email field.

Commands: `npm run check` (TypeScript), `npm run build`, `npm start`, `npm run seed` (safe initial content seed). The user requested to perform browser/interaction testing themselves; build and type checks are the handoff checks.

## Environment

- `MONGODB_URI`: Atlas SRV connection string, server only.
- `MONGODB_USERNAME`, `MONGODB_PASSWORD`: optional explicit authentication credentials.
- `MONGODB_DATABASE`: defaults to the URI database, then `cretechem`.
- `ADMIN_PASSWORD_HASH`, `ADMIN_PASSWORD_SALT`: bootstrap only. PBKDF2-SHA256, 100,000 iterations, 32-byte hex hash. Existing MongoDB credentials take priority.
- `NEXT_PUBLIC_SITE_URL`: public canonical origin, defaults to https://crete-chem.vercel.app.

Never use NEXT_PUBLIC variables for credentials. Local env files are ignored by Git and deployments. Sensitive Vercel pulls may contain `[REDACTED]`; use actual authorized credentials locally. The existing Vercel production secrets are retained.

## Persistence and migration

Initial database connection safely seeds six approved product families, six services, a free-inspection announcement and four comparison cases. A migration marker prevents deleted content being recreated. Existing admin credentials, orders and sessions are retained. The `npm run seed` command uses the same initialization.

Collections: products, services, banners, cases, media, inquiries, orders, admins, sessions, limits, activity, settings. Service product IDs are the authoritative relationship; the repository derives product service lists, and either admin editor updates the same relationship. Each service supports up to three recommendations.

Existing order JSON fields and `created_at` timestamps remain compatible. New admin sessions use an HTTP-only, same-site cookie scoped to `/`, secure on HTTPS, with an eight-hour lifetime. Old `/api` cookies are cleared on login/logout. Admin APIs validate sessions and request origins. Public submissions and login use MongoDB rate limits; order and inspection retries use stable request IDs.

## Customer features

- Service drawers and the retained problem finder recommend relevant product families.
- Product detail drawers include imagery, use cases, benefits, labels and quotation actions; full product routes remain shareable.
- Cart quantities, removal, local persistence and a two-step quotation request flow. Orders save to MongoDB before a WhatsApp link is offered. The customer explicitly sends the prepared message. No pricing or pack sizes are invented.
- Inspection forms save to the admin dashboard; service actions preselect the inspection service.
- Ask CRETE-CHEM guides problem/context intake and recommends services and up to three product families. The replaceable rule layer is in `src/lib/recommendations.ts`.
- Four independent mouse/touch/keyboard before-and-after sliders with stable aspect ratios and visible labels.
- Manufacturer videos, FAQs, city coverage, approved contact details and unlinked social icons are retained.

## Administration

Overview shows catalog counts, active/featured products, banners, orders, quick actions and recent changes. Product inventory supports search, category/status filters, create/edit/delete, benefits, applications, labels (including custom), featured state, image URL/upload and service mappings. Services, top banners and comparison cases have editors. Destructive actions require confirmation. Orders and inspections support search, status filters, pagination and status updates.

Uploads accept JPG, PNG, WebP and AVIF up to 2 MB. The server validates raster decoding, caps decoded pixels, resizes and converts to WebP, then stores the bytes in MongoDB. `/api/media/{id}` serves immutable images. External HTTPS image URLs are displayed directly, not through an unrestricted server proxy.

## Assets and source limits

The approved product catalog contains families, not individual SKUs or pack shots. Seed graphics are marked as product-family illustrations. Existing hero and roof images are retained. Basement, concrete and structural pairs are distinct engineering illustrations labeled as illustrative system studies, not completed client work. Replace them through the admin with approved photos when available, and clear the illustrative flag only for real project material. No project testimonials, performance statistics or guarantees were invented.

The guide's navy, blue, cyan, green and border tokens are implemented. Dark foregrounds on bright CTA fills preserve contrast. Dialog focus, Escape handling, nested scroll locking, touch scrolling, visible focus and reduced-motion styles are included.

## Structure

- `src/app/(site)`: marketing, catalog, product pages and legacy link redirect.
- `src/app/admin`: server-protected admin entry.
- `src/app/api/[...path]`: authentication, catalog CRUD, orders, inspections and media.
- `src/components`: reusable sections, drawers, assistant, cart and admin editors.
- `src/lib`: typed models, validation, Mongo connection, authentication, repository, seed and recommendation rules.
- `public/assets`: optimized images and SVG assets.

The previous static implementation remains for reference and is excluded from Vercel uploads. Root legacy API files are also excluded. Old `product.html?id=...`, `index.html` and `admin.html` links redirect to Next.js routes.

## Deployment

Run `vercel deploy --prod --yes` from the linked project. `vercel.json` selects Next.js and `.next` output. Deploy the complete project, not a partial file list. The old `scripts/build.mjs` build path is no longer used.

Public routes read current MongoDB content on each request; content edits need no rebuild. If storage is unavailable, the public approved seed catalog remains readable while authentication and submissions return an error rather than claiming success. WhatsApp remains available for direct contact.
