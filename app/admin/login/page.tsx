'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    
    if (res.ok) {
      router.push('/admin') // ← المهم دي
      router.refresh() // ← ودي عشان يعمل check للـ cookie
    } else {
      setError('الباسورد غلط')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-white text-3xl mb-8 text-center">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          className="w-full p-3 mb-4 bg-zinc-900 text-white rounded border border-zinc-800"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full p-3 bg-white text-black rounded font-bold disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  )
}
