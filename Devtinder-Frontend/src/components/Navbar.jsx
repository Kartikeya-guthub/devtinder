import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const links = [
  { to: '/feed', label: 'Feed' },
  { to: '/requests', label: 'Requests' },
  { to: '/connections', label: 'Connections' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const { logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    addToast('Logged out', 'info')
    navigate('/auth')
  }

  return (
    <header className="border-b border-border bg-white sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-primary tracking-tight">DevTinder</span>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-secondary hover:text-primary hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 text-sm text-danger font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
