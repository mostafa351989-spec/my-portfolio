'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, unread: 0 })
  const [chartData, setChartData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      fetchMessages(savedToken)
    }
  }, [])

  useEffect(() => {
    if (token) fetchMessages(token)
  }, [filter, status, page])

  const login = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    
    if (res.ok) {
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
      fetchMessages(data.token)
    } else {
      setError(data.error || 'حصل خطأ')
    }
    setLoading(false)
  }

  const fetchMessages = async (authToken) => {
    setLoading(true)
    const res = await fetch(`/api/messages?search=${search}&filter=${filter}&status=${status}&page=${page}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    const data = await res.json()
    
    if (res.ok) {
      setMessages(data.messages)
      setStats(data.stats)
      setChartData(data.chartData)
      setTotalPages(data.pagination.pages)
    } else {
      if (res.status === 401) logout()
      setError(data.error)
    }
    setLoading(false)
  }

  const markAsRead = async (id) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    fetchMessages(token)
  }

  const deleteMessage = async (id) => {
    if (!confirm('متأكد عايز تمسح الرسالة دي؟')) return
    await fetch(`/api/messages?id=${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchMessages(token)
  }

  const exportToCSV = () => {
    const headers = 'الاسم,الإيميل,الرسالة,التاريخ,الحالة\n'
    const rows = messages.map(m => 
      `"${m.name}","${m.email}","${m.message.replace(/"/g, '""')}","${new Date(m.createdAt).toLocaleString('ar-EG')}","${m.isRead ? 'مقروءة' : 'جديدة'}"`
    ).join('\n')
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `messages-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
    setMessages([])
  }

  if (!token) {
    return (
      <div style={{background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui'}}>
        <div style={{background: '#1a1a1a', padding: '50px', borderRadius: '16px', border: '2px solid #FFD700', maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(255,215,0,0.1)'}}>
          <h1 style={{color: '#FFD700', textAlign: 'center', marginBottom: '10px', fontSize: '32px'}}>لوحة التحكم Pro</h1>
          <p style={{textAlign: 'center', color: '#888', marginBottom: '30px'}}>مصطفى | Dashboard</p>
          <input 
            type="password" 
            placeholder="كلمة السر" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            style={{padding: '14px', width: '100%', marginBottom: '15px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontSize: '16px', boxSizing: 'border-box'}}
          />
          <button 
            onClick={login} 
            disabled={loading}
            style={{padding: '14px', width: '100%', background: '#FFD700', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'}}
          >
            {loading ? 'جاري الدخول...' : 'دخول للوحة التحكم'}
          </button>
          {error && <p style={{color: '#ff4444', textAlign: 'center', marginTop: '15px'}}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={{background: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
          <h1 style={{color: '#FFD700', margin: 0, fontSize: '36px'}}>لوحة التحكم Pro</h1>
          <button onClick={logout} style={{padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>تسجيل خروج</button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px'}}>
          <div style={{background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', border: '1px solid #333'}}>
            <div style={{color: '#888', fontSize: '14px'}}>إجمالي الرسائل</div>
            <div style={{color: '#FFD700', fontSize: '32px', fontWeight: 'bold'}}>{stats.total}</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', border: '1px solid #333'}}>
            <div style={{color: '#888', fontSize: '14px'}}>رسائل اليوم</div>
            <div style={{color: '#00ff88', fontSize: '32px', fontWeight: 'bold'}}>{stats.today}</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', border: '1px solid #333'}}>
            <div style={{color: '#888', fontSize: '14px'}}>آخر 7 أيام</div>
            <div style={{color: '#00aaff', fontSize: '32px', fontWeight: 'bold'}}>{stats.week}</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', border: '1px solid #333'}}>
            <div style={{color: '#888', fontSize: '14px'}}>غير مقروءة</div>
            <div style={{color: '#ff4444', fontSize: '32px', fontWeight: 'bold'}}>{stats.unread}</div>
          </div>
        </div>

        <div style={{background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px'}}>
          <h3 style={{color: '#FFD700', marginTop: 0}}>إحصائيات آخر 7 أيام</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="count" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
          <input 
            type="text" 
            placeholder="ابحث..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMessages(token)}
            style={{flex: 1, minWidth: '200px', padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff'}}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff'}}>
            <option value="all">كل الوقت</option>
            <option value="today">النهاردة</option>
            <option value="week">آخر أسبوع</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff'}}>
            <option value="all">كل الحالات</option>
            <option value="unread">غير مقروءة</option>
            <option value="read">مقروءة</option>
          </select>
          <button onClick={() => fetchMessages(token)} style={{padding: '12px 24px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>بحث</button>
          <button onClick={exportToCSV} style={{padding: '12px 24px', background: '#00aaff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>CSV</button>
        </div>

        {loading ? <p style={{textAlign: 'center', color: '#888'}}>جاري التحميل...</p> : messages.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px', color: '#666', background: '#1a1a1a', borderRadius: '12px'}}>
            <p style={{fontSize: '20px'}}>مفيش رسايل مطابقة</p>
          </div>
        ) : (
          <>
            <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
              {messages.map((msg) => (
                <div key={msg._id} style={{
                  background: 'linear-gradient(135deg, #1a1a1a, #222)', 
                  border: '1px solid #333', 
                  borderRadius: '12px', 
                  padding: '20px',
                  borderLeft: !msg.isRead ? '4px solid #00ff88' : '1px solid #333'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px'}}>
                    <div>
                      <div style={{fontSize: '18px', fontWeight: 'bold', color: '#FFD700'}}>
                        {msg.name} {!msg.isRead && <span style={{background: '#00ff88', color: '#000', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', marginRight: '8px'}}>جديدة</span>}
                      </div>
                      <div style={{color: '#00aaff', fontSize: '14px'}}>{msg.email}</div>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      {!msg.isRead && (
                        <button onClick={() => markAsRead(msg._id)} style={{background: '#00ff88', color: '#000', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'}}>
                          تحديد كمقروء
                        </button>
                      )}
                      <button onClick={() => deleteMessage(msg._id)} style={{background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px'}}>
                        حذف
                      </button>
                    </div>
                  </div>
                  <div style={{color: '#ddd', lineHeight: '1.6', marginBottom: '10px', whiteSpace: 'pre-wrap'}}>{msg.message}</div>
                  <div style={{color: '#666', fontSize: '13px', borderTop: '1px solid #333', paddingTop: '10px'}}>
                    {new Date(msg.createdAt).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1}}>
                السابق
              </button>
              <span style={{color: '#888'}}>صفحة {page} من {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1}}>
                التالي
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
