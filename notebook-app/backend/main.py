from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

app = FastAPI(title="Notebook API")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class NoteCreate(BaseModel):
    title: str
    content: str

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class Note(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

# 内存存储（简单实现）
notes_db: dict[str, Note] = {}

@app.get("/")
def root():
    return {"message": "Notebook API"}

@app.get("/notes", response_model=list[Note])
def get_notes():
    """获取所有笔记"""
    return list(notes_db.values())

@app.get("/notes/{note_id}", response_model=Note)
def get_note(note_id: str):
    """获取单个笔记"""
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    return notes_db[note_id]

@app.post("/notes", response_model=Note)
def create_note(note: NoteCreate):
    """创建笔记"""
    note_id = str(uuid.uuid4())
    now = datetime.now()
    new_note = Note(
        id=note_id,
        title=note.title,
        content=note.content,
        created_at=now,
        updated_at=now
    )
    notes_db[note_id] = new_note
    return new_note

@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: str, note: NoteUpdate):
    """更新笔记"""
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")

    existing_note = notes_db[note_id]
    update_data = note.model_dump(exclude_unset=True)

    updated_note = Note(
        id=existing_note.id,
        title=update_data.get("title", existing_note.title),
        content=update_data.get("content", existing_note.content),
        created_at=existing_note.created_at,
        updated_at=datetime.now()
    )
    notes_db[note_id] = updated_note
    return updated_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    """删除笔记"""
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    del notes_db[note_id]
    return {"message": "Note deleted"}
