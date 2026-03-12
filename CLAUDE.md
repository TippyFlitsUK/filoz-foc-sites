# filoz-foc-sites

Monorepo for FilOz websites hosted on Filecoin Onchain Cloud (FOC).

## Architecture

Each site lives under `sites/` as its own directory with its own build tooling (Next.js, Vite, vanilla HTML). The `shared/` directory contains framework-agnostic build and deploy scripts that auto-detect the site type.

## Sites

| Directory | Source | Framework | Output Dir | Dynamic Data |
|-----------|--------|-----------|-----------|-------------|
| `sites/filecoin-cloud/` | FilOzone/filecoin-cloud (fork) | Next.js 16 static export | `out/` | Client-side contract reads via viem |
| `sites/filecoin-services/` | filecoin.services (Lovable clone) | Vite SPA (pre-built) | `.` | Client-side contract reads via viem/ethers |
| `sites/pdp-explorer/` | FilOzone/pdp-explorer subgraph-client | Vite + React | `dist/` | Client-side GraphQL via Goldsky subgraph |
| `sites/filoz-home-desite/` | desite.filoz.org (wget clone) | Static HTML (Webflow) | `.` | None (fully static) |

## Commands

```bash
# Build a specific site
npm run build:filecoin-cloud

# Build all sites
npm run build

# Deploy a specific site to FOC
npm run deploy:filecoin-cloud

# Deploy all sites
npm run deploy
```

## Adding a New Site

1. Add the site source to `sites/<name>/`
2. The build script auto-detects: next.config.ts (Next.js), vite.config.ts (Vite), or index.html (static)
3. Add a `build:<name>` and `deploy:<name>` script to root package.json
4. Keep the upstream fork for syncing changes
5. For Vite SPAs, add a `spa-routes.json` listing client-side routes -- the build script copies index.html into each route dir for IPFS fallback

## Deploy

Required env vars for `npm run deploy`:
- `NOVA_SESSION_KEY` -- session key for FOC uploads
- `NOVA_WALLET_ADDRESS` -- wallet that created the session key
- `NOVA_PROVIDER_ID=1` -- ezpdpz-main (omitting this picks a random provider)

## Key Patterns

- Static shell pinned to Filecoin, dynamic data fetched client-side (JAMstack)
- All on-chain reads happen in the browser via viem/ethers -- no backend needed
- Sites use `nova deploy` to pin build output to FOC
- Each site keeps its own .gitignore, dependencies, and build config
- Upstream forks (TippyFlitsUK/<repo>) exist separately for tracking upstream changes

## Critical Rules

- Next.js sites MUST use `output: 'export'` and `images: { unoptimized: true }`
- Never add server-side API routes -- everything must work as static files
- Test with `npx serve out/` (or equivalent) before deploying to verify static behavior

## Gotchas

- pdp-explorer requires `.env` with Goldsky subgraph config -- see `.env.example`
- Vite SPA routes 404 on IPFS without `spa-routes.json` -- IPFS has no server-side fallback
- Next.js dynamic route handlers (robots.ts, sitemap.ts) fail with `output: 'export'` -- use static files in `public/` instead
- Sites are directory copies, not git subtrees -- upstream updates require manual merge
