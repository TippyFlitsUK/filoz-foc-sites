#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const sitesDir = resolve(import.meta.dirname, '..', 'sites')
const requestedSite = process.argv[2]

function getSites() {
  return readdirSync(sitesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function detectBuildCommand(siteDir) {
  const pkg = join(siteDir, 'package.json')
  const viteConfig = join(siteDir, 'vite.config.ts')
  const nextConfig = join(siteDir, 'next.config.ts')
  const indexHtml = join(siteDir, 'index.html')

  if (existsSync(pkg) && existsSync(nextConfig)) {
    return { install: 'npm ci', build: 'npm run build', output: 'out' }
  }
  if (existsSync(pkg) && existsSync(viteConfig)) {
    return { install: 'npm install', build: 'npm run build', output: 'dist' }
  }
  if (existsSync(indexHtml)) {
    return { install: null, build: null, output: '.' }
  }
  throw new Error(`Cannot detect build type for ${siteDir}`)
}

function buildSite(name) {
  const siteDir = join(sitesDir, name)
  if (!existsSync(siteDir)) {
    console.error(`Site not found: ${name}`)
    process.exit(1)
  }

  const config = detectBuildCommand(siteDir)
  console.log(`\n=== Building ${name} ===`)

  if (config.install) {
    console.log(`> ${config.install}`)
    execSync(config.install, { cwd: siteDir, stdio: 'inherit' })
  }

  if (config.build) {
    console.log(`> ${config.build}`)
    execSync(config.build, { cwd: siteDir, stdio: 'inherit' })
  }

  const outputDir = resolve(siteDir, config.output)
  console.log(`Build output: ${outputDir}`)
  return outputDir
}

const sites = requestedSite ? [requestedSite] : getSites()

for (const site of sites) {
  buildSite(site)
}
