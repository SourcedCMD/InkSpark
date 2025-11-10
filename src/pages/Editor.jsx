import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { supabase, generateShareToken } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Save, Share2, Download, Printer, ArrowLeft, Copy, Check, Lock, Unlock, FileText } from 'lucide-react'
import { format } from 'date-fns'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [shareToken, setShareToken] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const saveTimeoutRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (id) {
      loadNote()
    }
  }, [id])

  useEffect(() => {
    // Auto-save functionality
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (title || content) {
      saveTimeoutRef.current = setTimeout(() => {
        handleSave(true)
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content])

  const loadNote = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (data) {
        setTitle(data.title || '')
        setContent(data.content || '')
        setShareToken(data.share_token || '')
        setIsPublic(data.is_public || false)
        setIsReadOnly(data.is_readonly || false)
        setLastSaved(new Date(data.updated_at))
      }
    } catch (error) {
      console.error('Error loading note:', error)
      alert('Failed to load note')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (autoSave = false) => {
    if (!title.trim() && !content.trim()) return

    setSaving(true)
    try {
      const noteData = {
        user_id: user.id,
        title: title.trim() || 'Untitled Note',
        content: content,
        updated_at: new Date().toISOString(),
        share_token: shareToken || (isPublic ? generateShareToken() : null),
        is_public: isPublic,
        is_readonly: isReadOnly,
      }

      if (id) {
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('notes')
          .insert([{ ...noteData, created_at: new Date().toISOString() }])
          .select()
          .single()

        if (error) throw error
        if (data) {
          setShareToken(data.share_token || '')
          setIsPublic(data.is_public || false)
          navigate(`/editor/${data.id}`, { replace: true })
        }
      }

      setLastSaved(new Date())
      if (!autoSave) {
        alert('Note saved successfully!')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleShare = async () => {
    try {
      // If note doesn't exist yet, save it first
      if (!id) {
        if (!title.trim() && !content.trim()) {
          alert('Please add some content before sharing')
          return
        }
        
        // Save the note first
        setSaving(true)
        const newToken = generateShareToken()
        const noteData = {
          user_id: user.id,
          title: title.trim() || 'Untitled Note',
          content: content,
          updated_at: new Date().toISOString(),
          share_token: newToken,
          is_public: true,
          is_readonly: isReadOnly,
          created_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
          .from('notes')
          .insert([noteData])
          .select()
          .single()

        if (error) throw error

        if (data) {
          setShareToken(newToken)
          setIsPublic(true)
          const shareUrl = `${window.location.origin}/shared/${newToken}`
          navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          navigate(`/editor/${data.id}`, { replace: true })
        }
        setSaving(false)
        return
      }

      // Note exists, update sharing settings
      const newToken = shareToken || generateShareToken()
      setIsPublic(true)
      setShareToken(newToken)

      const { error } = await supabase
        .from('notes')
        .update({
          is_public: true,
          share_token: newToken,
        })
        .eq('id', id)

      if (error) throw error

      const shareUrl = `${window.location.origin}/shared/${newToken}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error sharing note:', error)
      alert('Failed to share note')
      setSaving(false)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([title + '\n\n' + content.replace(/<[^>]*>/g, '')], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = `${title || 'note'}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${title || 'Note'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${title || 'Untitled Note'}</h1>
          <div>${content}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-32 -left-24 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-white/10 shadow-md">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to Dashboard
          </button>
          {lastSaved && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Saved {format(lastSaved, 'hh:mm:ss a')}
            </span>
          )}
        </div>

        <div className="floating-panel px-5 py-6 sm:px-8 sm:py-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 floating-toolbar px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 text-white flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary-500 dark:text-primary-300 font-semibold">
                  InkSpark Editor
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Craft and share beautiful notes instantly
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-primary-500 text-white shadow-md shadow-primary-500/40 hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white/90 dark:bg-white/10 text-slate-700 dark:text-white border border-white/70 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-white/20 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </>
                )}
              </button>
              <button
                onClick={() => setIsReadOnly(!isReadOnly)}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white border border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors"
                title={isReadOnly ? 'Make editable' : 'Make read-only'}
              >
                {isReadOnly ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white border border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white border border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>

          {shareToken && isPublic && (
            <div className="floating-toolbar px-4 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary-600 dark:text-primary-300 mb-2">
                    Shareable Link
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/shared/${shareToken}`}
                      className="flex-1 px-3 py-2 bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-200"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/shared/${shareToken}`)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-primary-500 dark:text-primary-300 mt-2">
                    {isReadOnly ? 'Read-only link' : 'Editable link'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Title
            </label>
            <input
              type="text"
              placeholder="Untitled note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-2xl font-semibold bg-white/80 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-500/30 text-slate-800 dark:text-white shadow-inner"
            />
          </div>

          <div className="rounded-3xl border border-white/70 dark:border-white/10 bg-white/85 dark:bg-slate-900/60 shadow-[0px_35px_80px_rgba(15,23,42,0.12)] overflow-hidden">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Start writing your note..."
              readOnly={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

