'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  searchTerm?: string
  onSearchChange?: (term: string) => void
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  categories?: string[]
  siteLogo?: string
  siteName?: string
  headerStyle?: 'minimal' | 'classic' | 'modern' | 'fashion'
  logoSize?: number
}

export default function Navbar({ 
  searchTerm = '', 
  onSearchChange, 
  selectedCategory = 'All', 
  onCategoryChange,
  categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories'],
  siteLogo,
  siteName = 'brouna',
  headerStyle = 'minimal',
  logoSize = 40
}: NavbarProps) {
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    updateCartCount()
    
    // Listen for cart updates
    const handleCartUpdate = () => updateCartCount()
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
    setCartCount(count)
  }

  const getHeaderClasses = () => {
    switch(headerStyle) {
      case 'fashion':
        return 'bg-black text-white border-b-0'
      case 'classic':
        return 'bg-white border-b-2 border-white'
      case 'modern':
        return 'bg-gradient-to-r from-gray-50 to-white border-b border-white'
      default:
        return 'bg-white border-b border-white'
    }
  }

  const getTextClasses = () => {
    return headerStyle === 'fashion' ? 'text-white' : 'text-gray-700'
  }

  const getHoverClasses = () => {
    return headerStyle === 'fashion' ? 'hover:text-gray-300' : 'hover:text-black'
  }

  const getActiveClasses = () => {
    if (headerStyle === 'fashion') return 'text-white border-b-2 border-white pb-1'
    if (headerStyle === 'classic') return 'text-black border-b-2 border-black pb-1 font-bold'
    return 'text-black border-b-2 border-black pb-1'
  }

  return (
    <nav className={`sticky top-0 z-50 ${getHeaderClasses()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ minHeight: `${Math.max(64, logoSize + 16)}px` }}>
          <Link href="/" className="flex items-center space-x-3">
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} style={{ height: `${logoSize}px` }} className="w-auto" />
            ) : (
              <span className={`text-2xl font-bold tracking-wider ${headerStyle === 'fashion' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Museo Moderno', sans-serif" }}>
                {siteName}
              </span>
            )}
          </Link>
          
          {/* Regular navigation for other pages */}

          <div className="flex items-center space-x-4">
            {/* Show categories only on home page — right side */}
            {isHomePage && (
              <div className="hidden md:flex items-center space-x-6 mr-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange?.(category)}
                    className={`text-[10px] font-medium transition-colors ${
                      selectedCategory === category
                        ? getActiveClasses()
                        : `${getTextClasses()} ${getHoverClasses()}`
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
            {/* Regular navigation for other pages — right side */}
            {!isHomePage && (
              <div className="hidden md:flex items-center space-x-6 mr-2">
                <Link href="/" className={`text-[10px] font-medium ${getTextClasses()} ${getHoverClasses()} transition-colors`}>
                  Home
                </Link>
                <Link href="/products" className={`text-[10px] font-medium ${getTextClasses()} ${getHoverClasses()} transition-colors`}>
                  Products
                </Link>
              </div>
            )}
            {/* Search - show only on home page */}
            {isHomePage && (
              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="px-3 py-1.5 w-40 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            )}
            
            <Link href="/login" className={`p-2 rounded-full transition-colors ${headerStyle === 'fashion' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
              <User className={`w-5 h-5 ${getTextClasses()}`} />
            </Link>
            <Link href="/cart" className={`p-2 rounded-full transition-colors relative ${headerStyle === 'fashion' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
              <ShoppingBag className={`w-5 h-5 ${getTextClasses()}`} />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                  headerStyle === 'fashion' ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              className={`md:hidden p-2 rounded-full ${headerStyle === 'fashion' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className={`w-5 h-5 ${getTextClasses()}`} /> : <Menu className={`w-5 h-5 ${getTextClasses()}`} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              {isHomePage && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange?.(e.target.value)}
                      className="px-4 py-2 w-full border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryChange?.(category)
                          setMobileMenuOpen(false)
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}