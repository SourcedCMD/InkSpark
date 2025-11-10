import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import { FileText, Moon, Sun, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmailConfirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verifyEmail = async () => {
      // Check URL hash for Supabase auth tokens
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type') || searchParams.get('type')
      
      // Also check query params for token (some email clients may strip hash)
      const token = searchParams.get('token')

      // If we have tokens in the hash, Supabase has already processed them
      if (accessToken && refreshToken) {
        try {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            throw error
          }

          if (data?.user) {
            setStatus('success')
            setMessage('Email verified successfully! Redirecting to dashboard...')
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname)
            setTimeout(() => {
              navigate('/dashboard')
            }, 2000)
          }
        } catch (error) {
          console.error('Session error:', error)
          setStatus('error')
          setMessage('Failed to verify email. Please try signing in again.')
        }
      } else if (token && type === 'signup') {
        // Handle token-based verification (legacy or alternative method)
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          })

          if (error) {
            if (error.message?.includes('already been verified') || error.message?.includes('already confirmed')) {
              setStatus('success')
              setMessage('Your email has already been verified. You can now sign in.')
              setTimeout(() => {
                navigate('/login')
              }, 3000)
            } else {
              throw error
            }
          } else if (data?.user) {
            setStatus('success')
            setMessage('Email verified successfully! Redirecting to dashboard...')
            setTimeout(() => {
              navigate('/dashboard')
            }, 2000)
          }
        } catch (error) {
          console.error('Email verification error:', error)
          setStatus('error')
          setMessage(error.message || 'Failed to verify email. The link may have expired.')
        }
      } else {
        // Check if user is already logged in (might have been auto-confirmed)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setStatus('success')
          setMessage('Email already verified! Redirecting to dashboard...')
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Invalid verification link. Please check your email and try again, or request a new confirmation email.')
        }
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">InkSpark</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <Loader className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verifying your email...
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <div className="flex space-x-4 justify-center">
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Go to Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Sign Up Again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

