import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:8000'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // 获取所有笔记
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`)
      const data: Note[] = await res.json()
      setNotes(data)
    } catch (err) {
      console.error('获取笔记失败:', err)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // 选择笔记
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  // 创建新笔记
  const handleNewNote = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '新笔记', content: '' })
      })
      const newNote: Note = await res.json()
      setNotes([...notes, newNote])
      handleSelectNote(newNote)
    } catch (err) {
      console.error('创建笔记失败:', err)
    }
  }

  // 保存笔记
  const handleSave = async () => {
    if (!selectedNote) return
    try {
      const res = await fetch(`${API_URL}/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      const updatedNote: Note = await res.json()
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n))
      setSelectedNote(updatedNote)
    } catch (err) {
      console.error('保存笔记失败:', err)
    }
  }

  // 删除笔记
  const handleDelete = async () => {
    if (!selectedNote) return
    try {
      await fetch(`${API_URL}/notes/${selectedNote.id}`, {
        method: 'DELETE'
      })
      setNotes(notes.filter(n => n.id !== selectedNote.id))
      setSelectedNote(null)
      setTitle('')
      setContent('')
    } catch (err) {
      console.error('删除笔记失败:', err)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>笔记本</h1>
      </header>

      <div className="container">
        <aside className="sidebar">
          <button className="add-btn" onClick={handleNewNote}>
            + 新建笔记
          </button>
          <h2>我的笔记</h2>
          <ul className="note-list">
            {notes.map(note => (
              <li
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                onClick={() => handleSelectNote(note)}
              >
                <h3>{note.title || '无标题'}</h3>
                <p>{new Date(note.updated_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </aside>

        <main className="editor">
          {selectedNote ? (
            <>
              <input
                type="text"
                placeholder="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="开始写笔记..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="editor-actions">
                <button className="save-btn" onClick={handleSave}>
                  保存
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  删除
                </button>
              </div>
            </>
          ) : (
            <div className="editor-placeholder">
              <p>选择一个笔记或创建新笔记</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
