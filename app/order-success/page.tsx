'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'pending' | 'success' | 'failed'>('loading')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  useEffect(() => {
    const refid = searchParams.get('refid')
    const isPending = searchParams.get('pending')
    const txId = searchParams.get('txid') || localStorage.getItem('lastTransactionId')
    
    if (txId) {
      setTransactionId(txId)
    }
    
    if (isPending === 'true') {
      setPaymentStatus('pending')
      if (refid) {
        checkPaymentStatus(refid)
      } else if (txId) {
        checkOrderStatus(txId)
      }
    } else if (refid) {
      checkPaymentStatus(refid)
    } else {
      setPaymentStatus('success')
    }
  }, [searchParams])

  const checkPaymentStatus = async (refid: string) => {
    try {
      const response = await fetch(`/api/kpay?refid=${refid}`)
      const result = await response.json()
      
      setOrderDetails(result)
      
      if (result.statusid === '01') {
        setPaymentStatus('success')
      } else if (result.statusid === '03' || !result.statusid) {
        setPaymentStatus('pending')
      } else {
        setPaymentStatus('failed')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      setPaymentStatus('pending')
    }
  }

  const checkOrderStatus = async (txId: string) => {
    try {
      const response = await fetch('/api/orders')
      const result = await response.json()
      
      if (result.success && result.orders) {
        const order = result.orders.find((o: any) => o.transaction_id === txId)
        
        if (order) {
          setOrderDetails({
            tid: order.transaction_id,
            status: order.status,
            total: order.total,
            payment_method: order.payment_method
          })
          
          if (order.status === 'completed') {
            setPaymentStatus('success')
          } else if (order.status === 'cancelled' || order.status === 'failed') {
            setPaymentStatus('failed')
          } else {
            setPaymentStatus('pending')
          }
        } else {
          setPaymentStatus('pending')
        }
      }
    } catch (error) {
      console.error('Error checking order status:', error)
      setPaymentStatus('pending')
    }
  }

  const handleCheckStatus = () => {
    const refid = searchParams.get('refid')
    if (refid) {
      checkPaymentStatus(refid)
    } else if (transactionId) {
      checkOrderStatus(transactionId)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {(paymentStatus === 'loading' || paymentStatus === 'pending') && (
          <div>
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-8" />
            <h1 className="text-3xl font-light mb-4 tracking-wide">PAYMENT PENDING</h1>
            <p className="text-gray-600 mb-4">
              {orderDetails?.payment_method === 'MoMo' 
                ? 'Your order has been received and is awaiting confirmation.'
                : 'Your payment is being processed. Please check your phone for the payment prompt.'}
            </p>
            {orderDetails && (orderDetails.tid || orderDetails.refid) && (
              <div className="bg-yellow-50 p-6 mb-8 text-left">
                <h2 className="font-medium mb-4">Transaction Details</h2>
                {orderDetails.tid && (
                  <p className="text-sm text-gray-600 mb-2">
                    Transaction ID: {orderDetails.tid}
                  </p>
                )}
                {orderDetails.refid && (
                  <p className="text-sm text-gray-600 mb-2">
                    Reference: {orderDetails.refid}
                  </p>
                )}
                {orderDetails.status && (
                  <p className="text-sm text-gray-600 mb-2">
                    Status: <span className="capitalize">{orderDetails.status}</span>
                  </p>
                )}
                <p className="text-sm text-yellow-700 mt-4">
                  {orderDetails.payment_method === 'MoMo'
                    ? 'We will verify your payment and update your order status shortly.'
                    : 'Please complete the payment on your phone. Once completed, your order will be confirmed.'}
                </p>
              </div>
            )}
            <div className="space-y-4">
              <button
                onClick={handleCheckStatus}
                className="block w-full bg-black text-white py-3 px-8 hover:bg-gray-800 transition-colors"
              >
                CHECK STATUS AGAIN
              </button>
              <Link
                href="/products"
                className="block border border-gray-300 py-3 px-8 hover:bg-gray-50 transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-8" />
            <h1 className="text-3xl font-light mb-4 tracking-wide">ORDER CONFIRMED</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase! Your order has been successfully processed.
            </p>
            {orderDetails && (
              <div className="bg-gray-50 p-6 mb-8 text-left">
                <h2 className="font-medium mb-4">Order Details</h2>
                {orderDetails.tid && (
                  <p className="text-sm text-gray-600 mb-2">
                    Transaction ID: {orderDetails.tid}
                  </p>
                )}
                {orderDetails.refid && (
                  <p className="text-sm text-gray-600 mb-2">
                    Reference: {orderDetails.refid}
                  </p>
                )}
                {orderDetails.momtransactionid && (
                  <p className="text-sm text-gray-600">
                    Payment ID: {orderDetails.momtransactionid}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-4">
              <Link
                href="/products"
                className="block bg-black text-white py-3 px-8 hover:bg-gray-800 transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
              <Link
                href="/"
                className="block border border-gray-300 py-3 px-8 hover:bg-gray-50 transition-colors"
              >
                BACK TO HOME
              </Link>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-8" />
            <h1 className="text-3xl font-light mb-4 tracking-wide">PAYMENT FAILED</h1>
            <p className="text-gray-600 mb-8">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            {orderDetails && orderDetails.statusdesc && (
              <div className="bg-red-50 p-4 mb-8 text-left">
                <p className="text-sm text-red-600">
                  Error: {orderDetails.statusdesc}
                </p>
              </div>
            )}
            <div className="space-y-4">
              <Link
                href="/checkout"
                className="block bg-black text-white py-3 px-8 hover:bg-gray-800 transition-colors"
              >
                TRY AGAIN
              </Link>
              <Link
                href="/cart"
                className="block border border-gray-300 py-3 px-8 hover:bg-gray-50 transition-colors"
              >
                BACK TO CART
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-16"><div className="max-w-2xl mx-auto px-4 py-16 text-center">Loading...</div></div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
