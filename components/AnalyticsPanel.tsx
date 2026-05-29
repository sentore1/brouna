'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, MousePointer, Eye, Globe, Monitor, Smartphone, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/currency'

interface Analytics {
  pageViews: any[]
  clicks: any[]
  sessions: any[]
  conversions: any[]
  cartEvents: any[]
}

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<Analytics>({ pageViews: [], clicks: [], sessions: [], conversions: [], cartEvents: [] })
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    fetchAnalytics()
  }, [days])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('id, name')
    setProducts(data || [])
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?days=${days}`)
      const data = await res.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
    setLoading(false)
  }

  const stats = {
    totalViews: analytics.pageViews.length,
    totalClicks: analytics.clicks.length,
    totalSessions: analytics.sessions.length,
    avgPagesPerSession: analytics.sessions.length > 0 
      ? (analytics.sessions.reduce((sum, s) => sum + (s.pages_visited || 0), 0) / analytics.sessions.length).toFixed(1)
      : 0,
    totalRevenue: analytics.conversions
      .filter(c => c.event_type === 'purchase')
      .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
    totalOrders: analytics.conversions.filter(c => c.event_type === 'purchase').length,
    cartAdds: analytics.cartEvents.filter(c => c.event_type === 'add').length,
    conversionRate: analytics.sessions.length > 0
      ? ((analytics.conversions.filter(c => c.event_type === 'purchase').length / analytics.sessions.length) * 100).toFixed(1)
      : 0
  }

  const topPages = analytics.pageViews.reduce((acc: any, view) => {
    acc[view.page_url] = (acc[view.page_url] || 0) + 1
    return acc
  }, {})

  const topPagesArray = Object.entries(topPages)
    .map(([url, count]) => ({ url, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  const referrers = analytics.pageViews
    .filter(v => v.referrer && !v.referrer.includes(window.location.hostname))
    .reduce((acc: any, view) => {
      const ref = new URL(view.referrer || 'direct').hostname || 'Direct'
      acc[ref] = (acc[ref] || 0) + 1
      return acc
    }, {})

  const referrersArray = Object.entries(referrers)
    .map(([source, count]) => ({ source, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

  const devices = analytics.pageViews.reduce((acc: any, view) => {
    acc[view.device_type || 'unknown'] = (acc[view.device_type || 'unknown'] || 0) + 1
    return acc
  }, {})

  const productClicks = analytics.clicks
    .filter(c => c.product_id)
    .reduce((acc: any, click) => {
      acc[click.product_id] = (acc[click.product_id] || 0) + 1
      return acc
    }, {})

  const productClicksArray = Object.entries(productClicks)
    .map(([id, count]) => {
      const product = products.find(p => p.id === id)
      return { id, name: product?.name || id, count }
    })
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

  if (loading) {
    return <div className="bg-white rounded-lg border p-6">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Analytics Dashboard</h2>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">{stats.totalViews}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sessions</p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue, 'RWF')}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500">Cart Adds</p>
          <p className="text-xl font-bold">{stats.cartAdds}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500">Total Clicks</p>
          <p className="text-xl font-bold">{stats.totalClicks}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500">Avg Pages/Session</p>
          <p className="text-xl font-bold">{stats.avgPagesPerSession}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" /> Top Pages
          </h3>
          <div className="space-y-3">
            {topPagesArray.map((page: any, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm truncate flex-1">{page.url}</span>
                <span className="font-semibold ml-2">{page.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" /> Traffic Sources
          </h3>
          <div className="space-y-3">
            {referrersArray.length > 0 ? (
              referrersArray.map((ref: any, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm truncate flex-1">{ref.source}</span>
                  <span className="font-semibold ml-2">{ref.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No referrer data yet</p>
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5" /> Devices
          </h3>
          <div className="space-y-3">
            {Object.entries(devices).map(([device, count]: any, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm capitalize flex items-center gap-2">
                  {device === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  {device}
                </span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Clicks */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MousePointer className="w-5 h-5" /> Top Product Clicks
          </h3>
          <div className="space-y-3">
            {productClicksArray.length > 0 ? (
              productClicksArray.map((product: any, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm truncate flex-1">{product.name}</span>
                  <span className="font-semibold ml-2">{product.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No product clicks yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Recent Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Page</th>
                <th className="px-4 py-2 text-left">Device</th>
                <th className="px-4 py-2 text-left">Browser</th>
              </tr>
            </thead>
            <tbody>
              {analytics.pageViews.slice(0, 10).map((view, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{new Date(view.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{view.page_url}</td>
                  <td className="px-4 py-2 capitalize">{view.device_type}</td>
                  <td className="px-4 py-2">{view.browser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
