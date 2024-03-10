import './globals.css'
import { Inter } from 'next/font/google'
import { PT_Serif } from 'next/font/google';
import { Merriweather } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ['latin'] })
const ptSerif = PT_Serif({ subsets: ['latin'], weight: ['400', '700'] })
const merriWeather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900']})


export const metadata = {
  title: 'MeMori',
  description: 'A Grave Finder App',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={merriWeather.className}>
        <NextTopLoader />
        {children}
      </body>
    </html>
  )
}
