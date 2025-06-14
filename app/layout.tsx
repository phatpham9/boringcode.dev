import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PWAProvider } from "@/components/pwa-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeMeta } from "@/components/theme-meta"

export const metadata: Metadata = {
  title: "BoringCode.dev - Open Source Development Tools & Generators",
  description:
    "We write the boring stuff, so you don't have to. Discover our collection of open source development tools, code generators, and configuration packages for modern web development.",
  keywords: [
    "open source",
    "development tools",
    "code generators",
    "typescript",
    "javascript",
    "prettier config",
    "eslint config",
    "microservices",
    "boringcode",
    "developer productivity",
  ],
  authors: [{ name: "BoringCode.dev Team" }],
  creator: "BoringCode.dev",
  publisher: "BoringCode.dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boringcode.dev",
    siteName: "BoringCode.dev",
    title: "BoringCode.dev - Open Source Development Tools & Generators",
    description:
      "We write the boring stuff, so you don't have to. Discover our collection of open source development tools, code generators, and configuration packages.",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "BoringCode.dev - Open Source Development Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoringCode.dev - Open Source Development Tools & Generators",
    description:
      "We write the boring stuff, so you don't have to. Discover our collection of open source development tools and generators.",
    images: ["/og-image.png"],
    creator: "@boringcodedev",
  },
  alternates: {
    canonical: "https://boringcode.dev",
  },
  category: "technology",
  generator: "Next.js",
  applicationName: "BoringCode.dev",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="16x16" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* Theme-related meta tags will be dynamically updated by ThemeMeta component */}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ThemeMeta />
          <PWAProvider>{children}</PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
