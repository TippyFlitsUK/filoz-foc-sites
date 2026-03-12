import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { DEFAULT_METADATA, META_TITLE, META_DESCRIPTION } from '@/constants/site-metadata'
import { SiteLayout } from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  ...DEFAULT_METADATA,
}

type RootLayoutProps = Readonly<{ children: ReactNode }>

export default function RootLayout({ children }: RootLayoutProps) {
  return <SiteLayout>{children}</SiteLayout>
}
