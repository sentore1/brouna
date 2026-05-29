'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const phoneNumber = '+250788542633'

  const handleSend = () => {
    if (!message.trim()) return
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setMessage('')
    setIsOpen(false)
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {isOpen && (
        <div className="mb-2 bg-black rounded-lg shadow-xl p-4 w-72">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-600 text-sm placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <button className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-colors font-medium text-sm">
        Chat
      </button>
    </div>
  )
}
