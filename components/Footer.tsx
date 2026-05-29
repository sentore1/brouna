'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface SiteSettings {
  site_name: string
  site_logo: string
  footer_text_size: number
  footer_logo_size: number
  footer_show_border: boolean
  footer_show_logo: boolean
  footer_title_size: number
  footer_title_weight: number
  footer_title_font: string
  footer_title_line_height: number
  footer_symbol: string
}

interface FooterLink {
  id: string
  title: string
  slug: string
  enabled: boolean
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'brouna',
    site_logo: '',
    footer_text_size: 14,
    footer_logo_size: 32,
    footer_show_border: false,
    footer_show_logo: false,
    footer_title_size: 24,
    footer_title_weight: 600,
    footer_title_font: 'inherit',
    footer_title_line_height: 1.2,
    footer_symbol: '™'
  })
  const [links, setLinks] = useState<FooterLink[]>([])

  useEffect(() => {
    fetchSettings()
    fetchLinks()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('*').single()
      if (data) {
        // site_logo may be stored as JSON (with momo settings embedded)
        let siteLogo = data.site_logo
        if (siteLogo && siteLogo.startsWith('{')) {
          try {
            const parsed = JSON.parse(siteLogo)
            siteLogo = parsed.logo || ''
          } catch {}
        }
        setSettings({ ...data, site_logo: siteLogo })
      }
    } catch {}
  }

  const fetchLinks = async () => {
    try {
      const { data } = await supabase
        .from('pages')
        .select('id, title, slug, enabled')
        .eq('enabled', true)
        .order('sort_order')
      if (data) setLinks(data)
    } catch {}
  }

  return (
    <footer className={`py-6 ${settings.footer_show_border ? 'border-t' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          {settings.footer_show_logo && settings.site_logo ? (
            <img
              src={settings.site_logo}
              alt={settings.site_name}
              className="mb-3"
              style={{ height: `${settings.footer_logo_size}px` }}
            />
          ) : (
            <h2
              className="mb-3"
              style={{
                fontSize: `${settings.footer_title_size}px`,
                fontWeight: settings.footer_title_weight,
                fontFamily: settings.footer_title_font,
                lineHeight: settings.footer_title_line_height
              }}
            >
              {settings.site_name}<sup style={{ fontSize: '0.5em' }}>{settings.footer_symbol}</sup>
            </h2>
          )}

          {/* Footer page links */}
          {links.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mb-3" style={{ fontSize: `${settings.footer_text_size}px` }}>
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`/pages/${link.slug}`}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-500" style={{ fontSize: `${settings.footer_text_size}px` }}>
            <p>
              © {new Date().getFullYear()} {settings.site_name}<sup style={{ fontSize: '0.5em' }}>{settings.footer_symbol}</sup>. All rights reserved.
            </p>
            <span className="hidden sm:inline">•</span>
            <p>
              By{' '}
              <a
                href="https://instagram.com/abrohz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #10b981, #3b82f6)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient 3s ease infinite'
                }}
              >
                @abrohz
              </a>
            </p>
          </div>
          <style jsx>{`
            @keyframes gradient {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
        </div>
      </div>
    </footer>
  )
}
