import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Code Mood - Plateforme Éducative Interactive",
  description:
    "Exprimez votre humeur et vos préférences IA à travers le code - Outil pédagogique interactif pour étudiants et enseignants",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} neural-network-bg`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
