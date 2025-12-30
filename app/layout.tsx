import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ContextProvider } from '@/context'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Predict Base - Decentralized Prediction Markets',
  description: 'Create and participate in prediction markets on Base blockchain',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </ContextProvider>
      </body>
    </html>
  )
}
