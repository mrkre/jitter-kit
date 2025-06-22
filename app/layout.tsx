import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AppShell from '@/components/AppShell'
import { ToastProvider } from '@/components/ui/ToastProvider'
import pkg from '../package.json'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jitter Kit',
  description: 'A generative art playground built with Next.js and p5.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AppShell version={pkg.version}>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  )
}
