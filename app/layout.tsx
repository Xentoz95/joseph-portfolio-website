import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { AnalyticsProvider } from '@/components/analytics-provider'
import { ConsentBanner } from '@/components/consent-banner'
import './globals.css'
import '../styles/highlight.css'
import { metadata as portfolioMetadata } from '@/data/metadata'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: portfolioMetadata.title,
    template: '%s | Joseph Thuo',
  },
  description: portfolioMetadata.description,
  keywords: portfolioMetadata.keywords,
  authors: [{ name: portfolioMetadata.author }],
  creator: portfolioMetadata.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://josephthuo.com',
    title: portfolioMetadata.title,
    description: portfolioMetadata.description,
    siteName: 'Joseph Thuo Portfolio',
    images: [
      {
        url: portfolioMetadata.ogImage || '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: portfolioMetadata.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolioMetadata.title,
    description: portfolioMetadata.description,
    images: [portfolioMetadata.ogImage || '/og-image.jpg'],
    creator: '@josephthuo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  metadataBase: new URL('https://josephthuo.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AnalyticsProvider>
          {children}
          <Toaster />
          <Analytics />
          <ConsentBanner />
        </AnalyticsProvider>
      </body>
    </html>
  )
}
