'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) window.location.href = '/admin'
    else setError('الباسورد غلط')
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',background:'#0a0a0a',color:'#fff'}}>
      <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px',width:'320px'}}>
        <h1 style={{fontSize:'24px',fontWeight:'bold'}}>Admin Login</h1>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{padding:'12px',background:'#111',border:'1px solid #333',color:'#fff',borderRadius:'6px'}}
        />
        <button type="submit" style={{padding:'12px',background:'#fff',color:'#000',border:'none',borderRadius:'6px',fontWeight:'bold'}}>
          Login
        </button>
        {error && <p style={{color:'#ff5555'}}>{error}</p>}
      </form>
    </div>
  )
}
