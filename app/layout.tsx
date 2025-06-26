import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "WhatsApp Market - Buy & Sell WhatsApp Groups",
  description:
    "The premier marketplace for buying and selling WhatsApp groups and channels. Secure transactions, verified sellers, instant delivery.",
  keywords: "whatsapp, groups, channels, marketplace, buy, sell, secure, escrow",
  authors: [{ name: "WhatsApp Market" }],
  openGraph: {
    title: "WhatsApp Market - Buy & Sell WhatsApp Groups",
    description: "The premier marketplace for buying and selling WhatsApp groups and channels.",
    type: "website",
    locale: "en_US",
    siteName: "WhatsApp Market",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Market - Buy & Sell WhatsApp Groups",
    description: "The premier marketplace for buying and selling WhatsApp groups and channels.",
  },
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
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
