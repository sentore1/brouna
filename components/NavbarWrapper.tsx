'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'

interface SiteSettings {
  site_logo?: string
  site_name?: string
  header_style?: 'minimal' | 'classic' | 'modern' | 'fashion'
  logo_size?: number
}

export default function NavbarWrapper() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        let siteLogo = data.site_logo
        // site_logo may be stored as JSON with momo settings
        if (siteLogo && siteLogo.startsWith('{')) {
          try {
            const parsed = JSON.parse(siteLogo)
            siteLogo = parsed.logo || siteLogo
          } catch {}
        }
        setSettings({
          site_logo: siteLogo,
          site_name: data.site_name,
          header_style: data.header_style,
          logo_size: data.logo_size,
        })
      })
      .catch(() => {})
  }, [])

  // Home page handles its own navbar
  if (pathname === '/') return null

  return (
    <Navbar
      siteLogo={settings.site_logo}
      siteName={settings.site_name}
      headerStyle={settings.header_style}
      logoSize={settings.logo_size || 40}
    />
  )
}
