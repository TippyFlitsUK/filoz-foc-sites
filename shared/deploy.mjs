#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const sitesDir = resolve(import.meta.dirname, '..', 'sites')
const requestedSite = process.argv[2]
const extraArgs = process.argv.slice(3).join(' ')

function getSites() {
  return readdirSync(sitesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function getOutputDir(siteDir) {
  const nextConfig = join(siteDir, 'next.config.ts')
  const viteConfig = join(siteDir, 'vite.config.ts')
  const indexHtml = join(siteDir, 'index.html')

  if (existsSync(nextConfig)) return resolve(siteDir, 'out')
  if (existsSync(viteConfig)) return resolve(siteDir, 'dist')
  if (existsSync(indexHtml)) return siteDir
  throw new Error(`Cannot detect output dir for ${siteDir}`)
}

function deploySite(name) {
  const siteDir = join(sitesDir, name)
  if (!existsSync(siteDir)) {
    console.error(`Site not found: ${name}`)
    process.exit(1)
  }

  const outputDir = getOutputDir(siteDir)
  if (!existsSync(outputDir)) {
    console.error(`Build output not found: ${outputDir}`)
    console.error(`Run "npm run build:${name}" first`)
    process.exit(1)
  }

  console.log(`\n=== Deploying ${name} ===`)
  console.log(`Output dir: ${outputDir}`)

  const cmd = `nova deploy ${outputDir} --label ${name} ${extraArgs}`.trim()
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

const sites = requestedSite ? [requestedSite] : getSites()

for (const site of sites) {
  deploySite(site)
}
