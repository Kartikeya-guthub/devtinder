import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'
import SkeletonCard from '../components/SkeletonCard'

export default function Feed() {
  const [users, setUsers] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const { addToast } = useToast()

  const fetchFeed = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/feed?page=${p}&limit=10`)
      const data = res.data?.data || res.data || []
      if (data.length === 0) {
        setHasMore(false)
      } else {
        setUsers((prev) => (p === 1 ? data : [...prev, ...data]))
      }
    } catch (err) {
      addToast(err.displayMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchFeed(1)
  }, [fetchFeed])

  const handleAction = async (status) => {
    const current = users[index]
    if (!current) return
    setActionLoading(true)
    try {
      await api.post(`/request/send/${status}/${current._id}`)
      addToast(status === 'Interested' ? 'Request sent!' : 'Skipped', status === 'Interested' ? 'success' : 'info')
      // load next page if near the end
      if (index + 1 >= users.length - 2 && hasMore) {
        await fetchFeed(page + 1)
        setPage((p) => p + 1)
      }
      setIndex((i) => i + 1)
    } catch (err) {
      addToast(err.displayMessage, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const current = users[index]

  if (loading && users.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <SkeletonCard />
      </main>
    )
  }

  if (!current) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 text-center">
        <div className="card max-w-sm mx-auto">
          <p className="text-4xl mb-4">👋</p>
          <p className="text-primary font-medium">No more developers to show</p>
          <p className="text-secondary text-sm mt-1">Check back later for new profiles</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { setIndex(0); setPage(1); setHasMore(true); fetchFeed(1) }}
          >
            Refresh
          </Button>
        </div>
      </main>
    )
  }

  const name = `${current.firstName} ${current.lastName}`
  const initials = `${current.firstName?.[0] || ''}${current.lastName?.[0] || ''}`
  const skills = current.skills?.join(', ') || '—'

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="card max-w-sm mx-auto space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          {current.photoUrl ? (
            <img
              src={current.photoUrl}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-border flex items-center justify-center text-xl font-bold text-secondary">
              {initials}
            </div>
          )}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-primary">{name}</h2>
            {current.age && current.gender && (
              <p className="text-sm text-secondary">{current.age} · {current.gender}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        {current.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {current.skills.map((s) => (
              <span key={s} className="px-2 py-0.5 text-xs border border-border rounded-full text-secondary">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* About */}
        {current.about && (
          <p className="text-sm text-secondary text-center leading-relaxed">{current.about}</p>
        )}

        {/* Counter */}
        <p className="text-center text-xs text-secondary">
          {index + 1} / {users.length}{hasMore ? '+' : ''}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => handleAction('Ignore')}
            disabled={actionLoading}
            className="flex-1"
          >
            Ignore
          </Button>
          <Button
            variant="primary"
            onClick={() => handleAction('Interested')}
            disabled={actionLoading}
            className="flex-1"
          >
            Interested
          </Button>
        </div>
      </div>
    </main>
  )
}
