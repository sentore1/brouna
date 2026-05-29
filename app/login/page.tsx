'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        setSuccess('Account created! Please check your email to verify your account.')
        setEmail('')
        setPassword('')
        setTimeout(() => setIsSignUp(false), 2000)
      }
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        if (email === '4brohz@gmail.com') {
          router.push('/admin')
        } else {
          router.push('/account')
        }
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-light text-center mb-16 tracking-wide">
          {isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 focus:outline-none focus:border-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 font-medium tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? (isSignUp ? 'CREATING...' : 'SIGNING IN...') : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-600 text-sm text-center">
            {success}
          </div>
        )}

        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
            }}
            className="text-sm text-gray-600 hover:text-black underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-black">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}