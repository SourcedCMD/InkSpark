import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun, Home, Settings, LogOut, FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="app-shell">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 mt-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 text-white flex items-center justify-center shadow-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">InkSpark</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-white/90 dark:bg-white/10 text-primary-700 dark:text-primary-200 shadow-sm'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10'
                }`}
              >
                <Home className="inline-block h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'bg-white/90 dark:bg-white/10 text-primary-700 dark:text-primary-200 shadow-sm'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10'
                }`}
              >
                <Settings className="inline-block h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="hidden lg:inline">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-white/10 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/40 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl mx-4 mt-3 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-white/80 dark:bg-white/10 text-primary-700 dark:text-primary-200'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10'
                }`}
              >
                <Home className="inline-block h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/settings')
                    ? 'bg-white/80 dark:bg-white/10 text-primary-700 dark:text-primary-200'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10'
                }`}
              >
                <Settings className="inline-block h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={toggleTheme}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 flex items-center"
              >
                {theme === 'light' ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </div>
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}

