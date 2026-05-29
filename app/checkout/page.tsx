'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Smartphone, Copy, Check } from 'lucide-react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { convertPrice, formatPrice } from '../../lib/currency'
import { supabase } from '../../lib/supabase'
import QRCode from 'qrcode'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  currency?: string
}

interface PaymentSettings {
  payment_paypal_enabled: boolean
  payment_kpay_enabled: boolean
  payment_momo_enabled: boolean
  payment_polar_enabled: boolean
  polar_product_id: string
  momo_number: string
  momo_name: string
  momo_instructions: string
  momo_dial_code: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [kpayMethod, setKpayMethod] = useState('momo')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [settings, setSettings] = useState<PaymentSettings>({
    payment_paypal_enabled: true,
    payment_kpay_enabled: true,
    payment_momo_enabled: false,
    payment_polar_enabled: false,
    polar_product_id: '',
    momo_number: '',
    momo_name: '',
    momo_instructions: '',
    momo_dial_code: '*180*8*1*{number}*{amount}#'
  })
  const [formData, setFormData] = useState({
    email: '', phone: '', name: '', bankId: '63510',
    address: '', city: '', country: 'Rwanda', postalCode: ''
  })
  const [loading, setLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [momoStep, setMomoStep] = useState<'info' | 'confirm'>('info')
  const [transactionId, setTransactionId] = useState('')

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (savedCart.length === 0) { router.push('/cart'); return }
    setCartItems(savedCart)

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()

    fetch('/api/settings').then(r => r.json()).then(data => {
      console.log('Settings loaded:', data)
      setSettings(data)
      // auto-select first enabled method
      if (data.payment_momo_enabled) setPaymentMethod('momo')
      else if (data.payment_kpay_enabled) setPaymentMethod('kpay')
      else if (data.payment_polar_enabled) setPaymentMethod('polar')
      else if (data.payment_paypal_enabled) setPaymentMethod('paypal')
    }).catch(() => setPaymentMethod('paypal'))
  }, [router])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const currency = cartItems[0]?.currency || 'USD'

  useEffect(() => {
    if (settings.momo_number && total > 0) {
      const dialCode = `*180*8*1*${settings.momo_number}*${Math.round(total)}#`
      QRCode.toDataURL(`tel:${dialCode}`, { width: 200, margin: 1 })
        .then(url => setQrCodeUrl(url))
        .catch(() => {})
    }
  }, [settings.momo_number, total])

  const bankOptions = [
    { id: '63510', name: 'MTN Mobile Money', method: 'momo' },
    { id: '63514', name: 'Airtel Money', method: 'momo' },
    { id: '63502', name: 'SPENN', method: 'momo' },
    { id: '000', name: 'Visa/Mastercard', method: 'cc' }
  ]

  const saveOrder = async (transactionId: string, status: string, method: string) => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId, total, paymentMethod: method, transactionId,
        items: cartItems, status,
        customerName: formData.name, customerEmail: formData.email,
        customerPhone: formData.phone, shippingAddress: formData.address,
        shippingCity: formData.city, shippingCountry: formData.country,
        shippingPostalCode: formData.postalCode
      })
    })
  }

  const handleKpaySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderId = `ORDER_${Date.now()}`
      const response = await fetch('/api/kpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msisdn: formData.phone, email: formData.email, amount: total,
          customerName: formData.name, customerNumber: formData.phone,
          paymentMethod: kpayMethod, bankId: formData.bankId, orderId
        })
      })
      const result = await response.json()
      if (!result || typeof result !== 'object') { alert('Invalid response. Please try again.'); return }
      if (result.success === 1) {
        await saveOrder(result.tid, 'pending', `KPay-${kpayMethod}`)
        if (result.url && result.url.trim()) {
          window.location.href = result.url
        } else {
          alert(`Payment initiated!\n\nTransaction ID: ${result.tid}\n\nCheck your phone (${formData.phone}) for the payment prompt.`)
          window.location.href = `/order-success?refid=${result.refid}&pending=true`
        }
      } else {
        alert(`${result.reply || result.message || 'Payment failed'}. Please try again.`)
      }
    } catch { alert('Payment failed. Please try again.') }
    finally { setLoading(false) }
  }

  const handleMomoConfirm = async () => {
    if (!transactionId.trim()) { alert('Please enter your transaction ID'); return }
    
    setLoading(true)
    try {
      console.log('Submitting order:', {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        total,
        transactionId,
        itemCount: cartItems.length
      })

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, 
          total, 
          paymentMethod: 'MoMo', 
          transactionId,
          items: cartItems, 
          status: 'pending',
          customerName: formData.name, 
          customerEmail: formData.email,
          customerPhone: formData.phone, 
          shippingAddress: formData.address || 'N/A',
          shippingCity: formData.city || 'N/A', 
          shippingCountry: formData.country,
          shippingPostalCode: formData.postalCode || 'N/A'
        })
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      const result = await response.json()
      console.log('Order save result:', result)
      console.log('Response status:', response.status)
      console.log('Success field:', result.success)
      console.log('Error field:', result.error)
      
      if (result.success) {
        console.log('Order saved successfully, clearing cart')
        localStorage.removeItem('cart')
        localStorage.setItem('lastTransactionId', transactionId)
        window.location.href = `/order-success?pending=true&txid=${encodeURIComponent(transactionId)}`
      } else {
        console.error('Order save failed:', result.error)
        console.error('Full response:', result)
        alert('Failed to save order: ' + (result.error || 'Unknown error') + '\n\nPlease contact support with transaction ID: ' + transactionId)
      }
    } catch (error) {
      console.error('Order save exception:', error)
      alert('Failed to save order. Please contact support with your transaction ID: ' + transactionId)
    } finally {
      setLoading(false)
    }
  }

  const handlePolarCheckout = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email')
      return
    }

    if (!settings.polar_product_id) {
      alert('Polar payment is not configured. Please contact support.')
      return
    }

    setLoading(true)
    try {
      const orderId = `ORDER_${Date.now()}`
      
      // Save order first with pending status
      await saveOrder(orderId, 'pending', 'Polar')

      // Create Polar checkout session
      const response = await fetch('/api/polar/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: settings.polar_product_id,
          amount: total,
          currency,
          customerEmail: formData.email,
          customerName: formData.name,
          orderId,
        })
      })

      const result = await response.json()

      if (result.success && result.checkoutUrl) {
        // Redirect to Polar checkout
        window.location.href = result.checkoutUrl
      } else {
        alert('Failed to create checkout session: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Polar checkout error:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyNumber = () => {
    navigator.clipboard.writeText(settings.momo_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const enabledMethods = [
    settings.payment_momo_enabled && 'momo',
    settings.payment_kpay_enabled && 'kpay',
    settings.payment_polar_enabled && 'polar',
    settings.payment_paypal_enabled && 'paypal',
  ].filter(Boolean) as string[]

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-light text-center mb-16 tracking-wide">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>
            <div className="border border-gray-200 p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity} × {formatPrice(item.price, item.currency)}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity, item.currency)}</p>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl font-medium mb-6">Payment</h2>

            {/* Method selector */}
            {enabledMethods.length > 0 && (
              <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${enabledMethods.length}, 1fr)` }}>
                {settings.payment_momo_enabled && (
                  <button type="button" onClick={() => setPaymentMethod('momo')}
                    className={`p-3 border-2 text-sm font-medium transition-colors ${paymentMethod === 'momo' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                    MoMo
                  </button>
                )}
                {settings.payment_kpay_enabled && (
                  <button type="button" onClick={() => setPaymentMethod('kpay')}
                    className={`p-3 border-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${paymentMethod === 'kpay' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                    <Smartphone className="w-4 h-4" /> KPay
                  </button>
                )}
                {settings.payment_polar_enabled && (
                  <button type="button" onClick={() => setPaymentMethod('polar')}
                    className={`p-3 border-2 text-sm font-medium transition-colors ${paymentMethod === 'polar' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                    Polar
                  </button>
                )}
                {settings.payment_paypal_enabled && (
                  <button type="button" onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 border-2 text-sm font-medium transition-colors ${paymentMethod === 'paypal' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                    PayPal
                  </button>
                )}
              </div>
            )}

            {/* MoMo Payment */}
            {paymentMethod === 'momo' && (
              <div className="space-y-6">
                {momoStep === 'info' ? (
                  <>
                    {/* Customer Info Form */}
                    <div className="space-y-4 mb-6">
                      <h3 className="font-medium text-sm text-gray-700">Contact Information</h3>
                      <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                      <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                      <input type="tel" placeholder="Phone Number (e.g., 0783300000)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 text-center space-y-4">
                      <p className="text-sm font-medium text-gray-700">Pay via Mobile Money</p>

                      {/* QR Code */}
                      {qrCodeUrl && (
                        <div className="flex flex-col items-center gap-2">
                          <img src={qrCodeUrl} alt="MoMo QR Code" className="w-40 h-40 border border-gray-200 rounded" />
                          <p className="text-xs text-gray-500">Scan to dial</p>
                        </div>
                      )}

                      {/* Number + copy */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">MoMo Number</p>
                          <p className="text-2xl font-bold tracking-wider">{settings.momo_number}</p>
                          {settings.momo_name && <p className="text-sm text-gray-500 mt-1">{settings.momo_name}</p>}
                        </div>
                        <button onClick={copyNumber} className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Amount */}
                      <div className="bg-white border border-gray-200 rounded p-3">
                        <p className="text-xs text-gray-500">Amount to send</p>
                        <p className="text-xl font-bold">{formatPrice(total, currency)}</p>
                      </div>

                      {/* Dial button */}
                      <a
                        href={`tel:*180*8*1*${settings.momo_number}*${Math.round(total)}#`}
                        className="inline-block w-full bg-yellow-400 text-black py-3 font-medium text-center rounded hover:bg-yellow-500 transition-colors"
                      >
                        Tap to Dial & Pay
                      </a>

                      {settings.momo_instructions && (
                        <p className="text-xs text-gray-500 text-left">{settings.momo_instructions}</p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (!formData.name || !formData.email || !formData.phone) {
                          alert('Please fill in your contact information')
                          return
                        }
                        setMomoStep('confirm')
                      }}
                      className="w-full border-2 border-black py-3 font-medium hover:bg-black hover:text-white transition-colors"
                    >
                      I have paid — Enter Transaction ID
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Enter the transaction ID from your MoMo confirmation SMS to complete your order.</p>
                    <input
                      type="text"
                      placeholder="Transaction ID (e.g. 1234567890)"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={handleMomoConfirm}
                      className="w-full bg-black text-white py-4 font-medium hover:bg-gray-800 transition-colors"
                    >
                      Confirm Order
                    </button>
                    <button onClick={() => setMomoStep('info')} className="w-full text-sm text-gray-500 hover:text-black">
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* KPay */}
            {paymentMethod === 'kpay' && (
              <form onSubmit={handleKpaySubmit} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-700">Contact Information</h3>
                  <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                  <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                  <input type="tel" placeholder="Phone Number (e.g., 0783300000)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-sm text-gray-700">Shipping Address</h3>
                  <input type="text" placeholder="Street Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                    <input type="text" placeholder="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" />
                  </div>
                  <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-sm text-gray-700">Payment Method</h3>
                  <select value={kpayMethod} onChange={(e) => { setKpayMethod(e.target.value); const b = bankOptions.find(b => b.method === e.target.value); if (b) setFormData({...formData, bankId: b.id}) }} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required>
                    <option value="momo">Mobile Money</option>
                    <option value="cc">Credit/Debit Card</option>
                  </select>
                  <select value={formData.bankId} onChange={(e) => setFormData({...formData, bankId: e.target.value})} className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" required>
                    {bankOptions.filter(b => b.method === kpayMethod).map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {loading ? 'Processing...' : `Pay ${formatPrice(total, currency)}`}
                </button>
              </form>
            )}

            {/* Polar Payment */}
            {paymentMethod === 'polar' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-800">
                    <strong>Secure Payment via Polar</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Polar handles all payment processing, tax compliance, and provides instant access to your purchase.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-700">Contact Information</h3>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black" 
                    required 
                  />
                </div>

                <button 
                  onClick={handlePolarCheckout}
                  disabled={loading || !formData.email || !formData.name}
                  className="w-full bg-black text-white py-4 font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Continue to Polar Checkout - ${formatPrice(total, currency)}`}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to Polar's secure checkout page
                </p>
              </div>
            )}

            {/* PayPal */}
            {paymentMethod === 'paypal' && (
              <PayPalScriptProvider options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: 'USD', locale: 'en_US', components: 'buttons',
                'disable-funding': 'credit,card',
                'data-sdk-integration-source': 'button-factory'
              }}>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                  createOrder={async () => {
                    const response = await fetch('/api/paypal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'create', amount: total.toFixed(2), currency: 'USD' })
                    })
                    const order = await response.json()
                    return order.id
                  }}
                  onApprove={async (data) => {
                    await fetch('/api/paypal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'capture', orderId: data.orderID })
                    })
                    await saveOrder(data.orderID, 'completed', 'PayPal')
                    localStorage.removeItem('cart')
                    window.location.href = '/order-success'
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
