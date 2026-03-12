import type { NextConfig } from 'next'

const svgrRule = {
  test: /\.svg$/,
  use: ['@svgr/webpack'],
}

const markdownRule = {
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader',
  options: {
    mode: ['body', 'attributes', 'react-component'],
  },
}

const nextConfig: NextConfig = {
  output: 'export',
  typedRoutes: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push(svgrRule)
    config.module.rules.push(markdownRule)
    return config
  },
}

export default nextConfig
