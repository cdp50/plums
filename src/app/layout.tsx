import Header from '@/app/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '@/app/components/Footer'
import 'primeicons/primeicons.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import fav from "./favicon.ico"


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PLUMS',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
      <body className={inter.className}>
        
        <Header/> 
        {children}
        <Footer/>     
      
      </body>
      </UserProvider>
    </html>
  )
}
