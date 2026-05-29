'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

let sessionId: string | null = null

if (typeof window !== 'undefined') {
  sessionId = sessionStorage.getItem('analytics_session')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session', sessionId)
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isProduct = target.closest('[data-product-id]')
      const isButton = target.closest('button')
      const isLink = target.closest('a')

      if (isProduct || isButton || isLink) {
        const element = isProduct || isButton || isLink
        trackClick({
          elementType: isProduct ? 'product' : isButton ? 'button' : 'link',
          elementText: element?.textContent?.substring(0, 100) || '',
          productId: isProduct?.getAttribute('data-product-id') || undefined
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}

export function trackPageView() {
  if (typeof window === 'undefined') return

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'pageview',
      data: {
        url: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
        sessionId
      }
    })
  }).catch(() => {})
}

export function trackClick(data: { elementType: string; elementText: string; productId?: string }) {
  if (typeof window === 'undefined') return

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'click',
      data: {
        ...data,
        pageUrl: window.location.pathname
      }
    })
  }).catch(() => {})
}

export function trackAddToCart(product: { id: string; name: string; price: number; quantity: number }) {
  if (typeof window === 'undefined') return

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'cart_add',
      data: {
        sessionId,
        productId: product.id,
        productName: product.name,
        quantity: product.quantity,
        price: product.price
      }
    })
  }).catch(() => {})
}

export function trackPurchase(order: { orderId: string; amount: number; currency: string; products: any[] }) {
  if (typeof window === 'undefined') return

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'purchase',
      data: {
        sessionId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        products: order.products
      }
    })
  }).catch(() => {})
}
