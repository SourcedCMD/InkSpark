import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { FileText, Moon, Sun, Zap, Lock, Share2, Download, Printer } from 'lucide-react'

export default function About() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">InkSpark</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About InkSpark</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            InkSpark is a free, secure online notepad tool for taking notes, writing documents, saving ideas, and sharing content instantly.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Zap className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Blazing Fast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create and save notes to the cloud instantly with real-time auto-save.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Lock className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Private & Secure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Notes are encrypted when stored, keeping your data private and secure.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Share2 className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share unique links with anyone—editable or read-only options available.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Download className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Download & Print</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download notes as text files or print them directly from the platform.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Technology</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            InkSpark is built with modern web technologies:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-8">
            <li>React - A JavaScript library for building user interfaces</li>
            <li>Supabase - Backend as a service for authentication and database</li>
            <li>Tailwind CSS - Utility-first CSS framework for styling</li>
            <li>React Quill - Rich text editor component</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Privacy</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We take your privacy seriously:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-8">
            <li>All notes are encrypted when stored on our servers</li>
            <li>Your data is only accessible by you</li>
            <li>We don't track your usage or share your data with third parties</li>
            <li>Shared notes use unique tokens for security</li>
          </ul>

          <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Get Started</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ready to start taking notes? Create an account or sign in to get started.
            </p>
            <Link
              to="/signup"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 InkSpark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

