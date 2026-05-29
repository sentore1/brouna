'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Package, LogOut, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        loadUserProfile(user.id)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (data) {
      setProfileData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || ''
      })
    }
  }

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    setOrders(data || [])
  }

  const handleSaveProfile = async () => {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      })
    
    if (!error) {
      alert('Profile updated successfully!')
      setShowProfile(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-light text-center mb-16 tracking-wide">
          MY ACCOUNT
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            className="bg-gray-50 p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowProfile(true)}
          >
            <User className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h2 className="text-lg font-medium mb-2">Profile</h2>
            <p className="text-gray-600 text-sm">Manage your personal information</p>
          </div>

          <div 
            className="bg-gray-50 p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => {
              setShowOrders(true)
              loadOrders()
            }}
          >
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h2 className="text-lg font-medium mb-2">Orders</h2>
            <p className="text-gray-600 text-sm">View your order history</p>
          </div>

          {user?.email === 'admin@brouna.com' && (
            <div className="bg-black text-white p-8 text-center cursor-pointer hover:bg-gray-800 transition-colors"
                 onClick={() => router.push('/admin')}>
              <User className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">Admin Panel</h2>
              <p className="text-gray-300 text-sm">Manage products and orders</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mx-auto text-gray-600 hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-light mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-3 border border-gray-300 bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Address</label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleSaveProfile}
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setShowOrders(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-light mb-6">Order History</h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-lg font-medium">{order.total.toLocaleString()} RWF</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
