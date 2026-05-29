'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  // Only render navbar functionality for home page
  if (pathname === '/') {
    return null // Home page will handle its own navbar
  }
  
  return <Navbar />
}