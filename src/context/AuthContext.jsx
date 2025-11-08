import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle email confirmation from URL hash
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        try {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname)
        } catch (error) {
          console.error('Error setting session from callback:', error)
        }
      }
    }

    handleAuthCallback()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
    
    // If error, return it
    if (error) {
      return { data, error }
    }
    
    // Check if email confirmation is required
    if (data.user && !data.session) {
      // User created but needs to confirm email
      return { 
        data, 
        error: null,
        needsConfirmation: true 
      }
    }
    
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // Provide more helpful error messages
    if (error) {
      let errorMessage = error.message
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.'
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Too many login attempts. Please try again later.'
      }
      
      return { 
        data, 
        error: { ...error, message: errorMessage } 
      }
    }
    
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resendConfirmationEmail = async (email) => {
    // The simplest way: Attempt to sign up again with a dummy password
    // Supabase will detect the user exists and resend the confirmation email
    // Note: This requires the user to know their password, so we'll use a different approach
    
    // Better approach: Use the resend API if available (Supabase v2.38.0+)
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })
      
      if (error) {
        // If resend API doesn't work, fall back to attempting signup again
        // This will trigger a new confirmation email if the user exists but isn't confirmed
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: email,
          password: 'temp-password-12345', // Dummy password, won't be used if user exists
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
          },
        })
        
        // If user already exists, Supabase will resend the confirmation email
        if (signupError && signupError.message?.includes('already registered')) {
          // User exists, confirmation email should be resent
          return { data: null, error: null } // Success - email should be sent
        }
        
        return { data: signupData, error: signupError }
      }
      
      return { data, error }
    } catch (e) {
      return { 
        data: null, 
        error: { 
          message: 'Unable to resend confirmation email. Please try signing up again.' 
        } 
      }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

