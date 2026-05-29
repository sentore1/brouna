'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { formatPrice } from '../../lib/currency'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  currency?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const currency = cartItems[0]?.currency || 'USD'

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black mb-8">
            <ArrowLeft className="w-5 h-5" />Back
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-light mb-8 tracking-wide">YOUR CART</h1>
            <p className="text-gray-500 mb-8">Your cart is empty</p>
            <Link
              href="/"
              className="bg-black text-white px-8 py-3 text-sm tracking-wide hover:bg-gray-800 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black mb-8">
          <ArrowLeft className="w-5 h-5" />Back
        </Link>
        
        <h1 className="text-3xl font-light text-center mb-16 tracking-wide">
          YOUR CART
        </h1>

        <div className="space-y-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-6 py-6 border-b border-gray-100">
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm">Price: <span className="font-medium">{formatPrice(item.price, item.currency)}</span></p>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right min-w-[120px]">
                <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                <p className="text-lg font-semibold mb-2">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 ml-auto"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-3 text-gray-600">
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span className="font-medium">{formatPrice(total, currency)}</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-gray-600">
              <span>Shipping</span>
              <span className="text-sm">Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatPrice(total, currency)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 border-2 border-gray-300 py-4 text-center hover:bg-gray-50 transition-colors font-medium"
            >
              CONTINUE SHOPPING
            </Link>
            <Link
              href="/checkout"
              className="flex-1 bg-black text-white py-4 text-center hover:bg-gray-800 transition-colors font-medium"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}