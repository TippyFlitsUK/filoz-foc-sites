# filoz-foc-sites

FilOz websites hosted on [Filecoin Onchain Cloud](https://filecoin.cloud) (FOC).

Static site shells pinned to Filecoin with dynamic data fetched client-side via blockchain RPCs and GraphQL -- the JAMstack pattern on decentralized storage.

## Sites

| Site | Source | Framework | Dynamic Data |
|------|--------|-----------|-------------|
| [filecoin-cloud](sites/filecoin-cloud/) | [FilOzone/filecoin-cloud](https://github.com/FilOzone/filecoin-cloud) | Next.js 16 static export | Contract reads via viem |
| [filecoin-services](sites/filecoin-services/) | [filecoin.services](https://www.filecoin.services/) | Vite SPA (pre-built) | Contract reads via viem/ethers |
| [pdp-explorer](sites/pdp-explorer/) | [FilOzone/pdp-explorer](https://github.com/FilOzone/pdp-explorer) | Vite + React | GraphQL via Goldsky subgraph |
| [filoz-home-desite](sites/filoz-home-desite/) | [desite.filoz.org](https://desite.filoz.org) | Static HTML (Webflow) | None (fully static) |

## Quick Start

```bash
# Build a specific site
npm run build:filecoin-cloud

# Build all sites
npm run build

# Deploy a specific site to FOC
NOVA_SESSION_KEY=... NOVA_WALLET_ADDRESS=... NOVA_PROVIDER_ID=1 \
  npm run deploy:filecoin-cloud

# Deploy all sites
npm run deploy
```

## How It Works

Each site lives under `sites/` with its own build tooling. The shared build and deploy scripts in `shared/` auto-detect the framework:

- **next.config.ts** -- Next.js static export (`npm ci && npm run build` -> `out/`)
- **vite.config.ts** -- Vite SPA (`npm install && npm run build` -> `dist/`)
- **index.html** -- Pre-built static site (no build step, output is `.`)

Deployment uses [filecoin-nova](https://github.com/FilOzone/filecoin-nova) to pin build output to FOC. Content is accessible via any IPFS gateway (e.g. `https://<cid>.ipfs.dweb.link`).

### IPFS SPA Routing

IPFS has no server-side routing fallback. For SPAs, a `spa-routes.json` file in the site directory lists all client-side routes. The build script copies `index.html` into each route path so direct navigation works on IPFS.

## Adding a New Site

1. Add the site source to `sites/<name>/`
2. Add `build:<name>` and `deploy:<name>` scripts to `package.json`
3. For Vite SPAs, add a `spa-routes.json` with the client-side routes
4. Ensure all dynamic data is fetched client-side -- no server-side APIs
