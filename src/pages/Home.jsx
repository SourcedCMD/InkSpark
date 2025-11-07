import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FileText, Zap, Lock, Share2, Download, Printer, Moon, Sun, ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CMDNote</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Free online notepad with instant sharing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            A fast and simple free online text editor that makes creating and sharing notes easy – No account needed to get started!
          </p>
          {!user && (
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
            >
              Create Free Note
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
          {user && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why use CMDNote?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Zap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Blazing Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create and save notes to the cloud instantly.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Lock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Notes are encrypted when stored, keeping your data private.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Share2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share unique links with anyone—no sign-up required.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
            <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Text Formatting</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your notes with easy formatting tools.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Download className="h-10 w-10 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get your notes as text files with one click.
            </p>
          </div>
          <div className="text-center">
            <Printer className="h-10 w-10 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Print</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Print your notes directly from the platform.
            </p>
          </div>
          <div className="text-center">
            <Zap className="h-10 w-10 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Autosave</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your notes are saved in real-time as you type.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 CMDNote. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

