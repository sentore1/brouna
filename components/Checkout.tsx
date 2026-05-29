'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface CheckoutProps {
  amount: number
  onSuccess: (paymentData: any) => void
}

export default function Checkout({ amount, onSuccess }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'kpay' | 'paypal'>('kpay')

  const handleKPayPayment = async () => {
    const response = await fetch('/api/kpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'MMK',
        // Add other required KPay fields
      })
    })
    const result = await response.json()
    onSuccess(result)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
      
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="kpay"
            checked={paymentMethod === 'kpay'}
            onChange={(e) => setPaymentMethod(e.target.value as 'kpay')}
            className="mr-2"
          />
          KPay
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
            className="mr-2"
          />
          PayPal (USD)
        </label>
      </div>

      {paymentMethod === 'kpay' && (
        <button
          onClick={handleKPayPayment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Pay with KPay
        </button>
      )}

      {paymentMethod === 'paypal' && (
        <PayPalScriptProvider options={{ 
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: 'USD'
        }}>
          <PayPalButtons
            createOrder={async () => {
              const response = await fetch('/api/paypal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', amount })
              })
              const order = await response.json()
              return order.id
            }}
            onApprove={async (data) => {
              const response = await fetch('/api/paypal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'capture', orderId: data.orderID })
              })
              const result = await response.json()
              onSuccess(result)
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  )
}