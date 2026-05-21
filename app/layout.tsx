import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthSessionProvider } from '@/components/providers/SessionProvider'
import './globals.css'
import '../styles/globals.css';


const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Arc Tech - Software House Islamabad',
  description: 'Arc Tech: Professional software development and web solutions from Islamabad, Pakistan',
  generator: 'Abdullah Baig',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
    viewportFit: 'cover',
  },
  icons: {
    icon: '/arc-tech-favicon.svg',
    apple: '/arc-tech-favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ backgroundColor: 'rgb(10 14 39)' }}>
      <body className={`${inter.variable} font-sans antialiased`} style={{ backgroundColor: 'rgb(10 14 39)', color: 'rgb(224 231 255)' }}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
