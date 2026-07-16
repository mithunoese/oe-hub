# OE Hub

Next.js + NeonDB (serverless Postgres) + Tailwind. Deployed at oe-hub-one.vercel.app.

## Stack
- Next.js App Router, TypeScript, Tailwind CSS
- NeonDB (`@neondatabase/serverless`) — use parameterized queries, no raw string concat
- jsPDF for report generation
- Vercel deployment (preview + prod)

## Key paths
- `src/app/` — App Router pages and API routes
- `src/components/` — shared UI components
- `src/lib/` — DB helpers, utilities
- `src/data/` — static data / seed files
- `templates/` — report/email templates

## Conventions
- API routes return `{ success, data?, error? }`
- No console.log in committed code
- Tailwind only — no CSS modules or inline styles
- DB connections via NeonDB serverless driver, not pg directly

## Deploy
```
vercel --prod   # production
vercel          # preview
```
Check Vercel MCP for deployment status before and after changes.
