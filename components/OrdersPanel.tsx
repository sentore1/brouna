'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Package, MapPin, Phone, Mail, Calendar, DollarSign } from 'lucide-react'

interface Order {
  id: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  total: number
  status: string
  transaction_id?: string
  payment_method?: string
  items?: any[]
  created_at: string
  updated_at?: string
  shipping_address?: string
  shipping_city?: string
  shipping_country?: string
  shipping_postal_code?: string
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const getCurrencySymbol = (paymentMethod?: string) => {
    if (!paymentMethod) return '$'
    const method = paymentMethod.toLowerCase()
    if (method.includes('momo') || method.includes('kpay')) return 'K'
    return '$'
  }

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders via API...')
      const response = await fetch('/api/orders')
      const result = await response.json()
      
      console.log('Orders API result:', result)
      
      if (result.success && result.orders) {
        console.log('Orders fetched:', result.orders.length)
        setOrders(result.orders)
      } else {
        console.error('Failed to fetch orders:', result.error)
      }
    } catch (error) {
      console.error('Exception fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        alert(`Failed to update status: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-medium">Orders Management ({orders.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-900">
                  {order.transaction_id || order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-medium text-gray-900">{order.customer_name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col gap-1">
                    {order.customer_email && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{order.customer_email}</span>
                      </div>
                    )}
                    {order.customer_phone && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{order.customer_phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-gray-400 text-xs">N/A</span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {getCurrencySymbol(order.payment_method)}{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.payment_method || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No orders yet
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-medium">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Order ID</label>
                  <p className="font-mono text-sm">{selectedOrder.transaction_id || selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Date</label>
                  <p className="text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Name</label>
                    <p className="text-sm">{selectedOrder.customer_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="text-sm">{selectedOrder.customer_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone</label>
                    <p className="text-sm">{selectedOrder.customer_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shipping_address}</p>
                    {selectedOrder.shipping_city && <p>{selectedOrder.shipping_city}</p>}
                    {selectedOrder.shipping_country && <p>{selectedOrder.shipping_country}</p>}
                    {selectedOrder.shipping_postal_code && <p>{selectedOrder.shipping_postal_code}</p>}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          {item.products?.image && (
                            <img src={item.products.image} alt={item.products.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{item.products?.name || 'Product'}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-sm">{getCurrencySymbol(selectedOrder.payment_method)}{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items found</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-medium">
                  <span>Total</span>
                  <span>{getCurrencySymbol(selectedOrder.payment_method)}{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Payment Method</label>
                <p className="text-sm">{selectedOrder.payment_method || 'N/A'}</p>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Order Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value)
                  }}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
