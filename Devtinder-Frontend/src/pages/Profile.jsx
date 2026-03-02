import { useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'

const SKILLS_OPTIONS = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'Rust', 'Java', 'CSS', 'Docker', 'GraphQL', 'MongoDB']

export default function Profile() {
  const { user, fetchMe } = useAuth()
  const { addToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    gender: user?.gender || '',
    about: user?.about || '',
    skills: user?.skills || [],
    photoUrl: user?.photoUrl || '',
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/profile/edit', {
        firstName: form.firstName,
        lastName: form.lastName,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        about: form.about || undefined,
        skills: form.skills,
        photoUrl: form.photoUrl || undefined,
      })
      await fetchMe()
      addToast('Profile updated!', 'success')
      setEditing(false)
    } catch (err) {
      addToast(err.displayMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const name = `${user?.firstName} ${user?.lastName}`
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Profile</h1>
        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {!editing ? (
        /* View mode */
        <div className="card space-y-5">
          <div className="flex items-center gap-4">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt={name} className="w-16 h-16 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-border flex items-center justify-center text-xl font-bold text-secondary">
                {initials}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-primary">{name}</p>
              <p className="text-sm text-secondary">{user?.emailId}</p>
              {user?.age && user?.gender && (
                <p className="text-xs text-secondary mt-0.5">{user.age} · {user.gender}</p>
              )}
            </div>
          </div>

          {user?.about && (
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-1">About</p>
              <p className="text-sm text-primary">{user.about}</p>
            </div>
          )}

          {user?.skills?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs border border-border rounded-full text-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Edit mode */
        <form onSubmit={handleSave} className="card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.firstName} onChange={set('firstName')} />
            <Input label="Last Name" value={form.lastName} onChange={set('lastName')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" value={form.age} onChange={set('age')} placeholder="25" min="18" max="99" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Gender</label>
              <select className="input-field" value={form.gender} onChange={set('gender')}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary uppercase tracking-wide">About</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.about}
              onChange={set('about')}
              placeholder="Tell other developers about yourself..."
            />
          </div>
          <Input label="Photo URL" value={form.photoUrl} onChange={set('photoUrl')} placeholder="https://..." />

          <div>
            <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {SKILLS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    form.skills.includes(s)
                      ? 'bg-accent text-white border-accent'
                      : 'border-border text-secondary hover:border-accent hover:text-accent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 justify-center">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(false)}
              className="flex-1 justify-center"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </main>
  )
}
