import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Plus, FileText, Search, Trash2, Share2, Calendar, Edit } from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
      setNotes(notes.filter(note => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    }
  }

  const handleCreateNote = () => {
    navigate('/editor')
  }

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase()
    return (
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-32 right-0 h-56 w-56 rounded-full bg-primary-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative space-y-6">
        <div className="floating-toolbar px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-500 dark:text-primary-300 font-semibold">
              Your Workspace
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-800 dark:text-white tracking-tight">
              My Notes
            </h1>
            <p className="text-slate-500 dark:text-slate-300">
              Capture ideas, save thoughts, and collaborate instantly.
            </p>
          </div>
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Note
          </button>
        </div>

        <div className="floating-panel px-6 py-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/70 dark:border-white/10 text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-200/80 dark:focus:ring-primary-500/30 shadow-inner"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="floating-panel px-10 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 dark:bg-white/10 shadow-lg">
              <FileText className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              {searchQuery ? 'No notes match that search' : 'Create your first note'}
            </h3>
            <p className="text-slate-500 dark:text-slate-300 mb-6 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different keyword or create a new note to capture fresh ideas.'
                : 'InkSpark saves every keystroke so you can focus on writing.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="floating-panel p-6 hover:-translate-y-1 hover:shadow-[0px_30px_80px_rgba(15,23,42,0.18)] transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/editor/${note.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white truncate flex-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/editor/${note.id}`)
                      }}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/70 dark:hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(note.id)
                      }}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white/70 dark:hover:bg-white/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                  {note.content?.replace(/<[^>]*>/g, '').substring(0, 140)}...
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(note.updated_at), 'MMM d, yyyy')}
                  </div>
                  {note.share_token && (
                    <div className="flex items-center text-primary-600 dark:text-primary-400">
                      <Share2 className="h-3 w-3 mr-1" />
                      Shared
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

