import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import { ArrowLeft, Download, Printer, Moon, Sun, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function SharedNote() {
  const { token } = useParams()
  const { theme, toggleTheme } = useTheme()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSharedNote()
  }, [token])

  const loadSharedNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single()

      if (error) throw error
      if (data) {
        setNote(data)
        setContent(data.content || '')
      }
    } catch (error) {
      console.error('Error loading shared note:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!note || note.is_readonly) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)

      if (error) throw error
      alert('Note updated successfully!')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([(note?.title || 'note') + '\n\n' + content.replace(/<[^>]*>/g, '')], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = `${note?.title || 'note'}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${note?.title || 'Note'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${note?.title || 'Untitled Note'}</h1>
          <div>${content}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Note not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This note may have been deleted or the link is invalid.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CMDNote</span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {note.is_readonly && (
              <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {note.title || 'Untitled Note'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {note.is_readonly && (
              <span className="text-sm text-gray-500 dark:text-gray-400">Read-only</span>
            )}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Last updated: {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {note.is_readonly ? (
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                readOnly={false}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ color: [] }, { background: [] }],
                    ['link'],
                    ['clean'],
                  ],
                }}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

