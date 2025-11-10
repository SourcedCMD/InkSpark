import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FileText, Zap, Lock, Share2, Download, Printer, Moon, Sun, ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[-20%] h-[60vh] bg-gradient-to-b from-primary-400/25 via-transparent to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 text-white flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">InkSpark</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="floating-panel px-8 py-10 sm:px-16 sm:py-16 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 text-sm font-semibold">
              Elegant Cloud-Powered Notepad
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Write, organize, and share in seconds
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              InkSpark captures every thought with instant autosave, floating notes, and shareable links inspired by the sleek experience of Hyper Notepad.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-colors"
              >
                {user ? 'Open Dashboard' : 'Create Free Note'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 rounded-xl border border-white/70 dark:border-white/10 bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white font-semibold hover:bg-white dark:hover:bg-white/20 transition-colors"
                >
                  Sign in instead
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
          Why creators choose InkSpark
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap className="h-10 w-10 text-primary-500" />,
              title: 'Instant Capture',
              desc: 'Autosave ensures every idea is safe the moment you type it.',
            },
            {
              icon: <Lock className="h-10 w-10 text-primary-500" />,
              title: 'Secure by Design',
              desc: 'Encrypted storage and granular sharing keep your notes private.',
            },
            {
              icon: <Share2 className="h-10 w-10 text-primary-500" />,
              title: 'Share in One Click',
              desc: 'Generate editable or view-only links just like Hyper Notepad.',
            },
            {
              icon: <FileText className="h-10 w-10 text-primary-500" />,
              title: 'Rich Formatting',
              desc: 'Headings, lists, highlights, and more in a sleek floating canvas.',
            },
          ].map((feature) => (
            <div key={feature.title} className="floating-panel px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 dark:bg-white/10 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="floating-panel px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <Download className="mx-auto h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Download</h3>
              <p className="text-slate-500 dark:text-slate-300">
                Export polished notes as TXT files in a heartbeat.
              </p>
            </div>
            <div className="text-center">
              <Printer className="mx-auto h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Print</h3>
              <p className="text-slate-500 dark:text-slate-300">
                Ready-to-print layouts look crisp on every page.
              </p>
            </div>
            <div className="text-center">
              <Zap className="mx-auto h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Autosave</h3>
              <p className="text-slate-500 dark:text-slate-300">
                Real-time autosave keeps your floating canvas synced.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-6 py-4 shadow-md">
          <p className="text-slate-600 dark:text-slate-300">
            © 2025 InkSpark. Crafted with inspiration from{' '}
            <a href="https://hypernotepad.com/" className="text-primary-500 hover:underline">
              Hyper Notepad
            </a>
            .
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

