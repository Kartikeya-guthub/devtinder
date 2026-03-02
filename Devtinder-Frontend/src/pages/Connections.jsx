import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'

function ConnectionCard({ user }) {
  const name = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {user.photoUrl ? (
        <img src={user.photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover border border-border" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-border flex items-center justify-center text-sm font-semibold text-secondary">
          {initials}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-primary">{name}</p>
        {user.skills?.length > 0 && (
          <p className="text-xs text-secondary">{user.skills.slice(0, 3).join(', ')}</p>
        )}
      </div>
    </div>
  )
}

export default function Connections() {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const fetchConnections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/user/connections')
      setConnections(res.data?.data || res.data || [])
    } catch (err) {
      addToast(err.displayMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Connections</h1>
        <span className="text-sm text-secondary">{connections.length} total</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-secondary text-sm">No connections yet</p>
          <p className="text-xs text-secondary mt-1">Start swiping on the Feed!</p>
        </div>
      ) : (
        <div className="card px-6 py-0">
          {connections.map((conn) => (
            <ConnectionCard key={conn._id} user={conn} />
          ))}
        </div>
      )}
    </main>
  )
}
