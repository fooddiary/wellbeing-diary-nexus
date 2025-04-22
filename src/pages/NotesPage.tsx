
import { useState } from "react";

// Example notes
const dummyNotes = [
  {
    id: 1,
    title: "Цели на апрель",
    content: "1. Пить больше воды\n2. Есть больше овощей\n3. Контролировать размеры порций",
    date: "2023-04-01",
  },
  {
    id: 2,
    title: "Рецепт смузи",
    content: "Банан, шпинат, молоко, лед - все взбить в блендере.",
    date: "2023-04-05",
  },
  {
    id: 3,
    title: "Заметки о самочувствии",
    content: "После исключения сахара чувствую себя намного лучше. Больше энергии, меньше усталости.",
    date: "2023-04-10",
  },
];

const NotesPage = () => {
  const [notes, setNotes] = useState(dummyNotes);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSelectNote = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setSelectedNote(id);
      setTitle(note.title);
      setContent(note.content);
      setIsEditing(false);
    }
  };
  
  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (title.trim() === "") return;
    
    if (selectedNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === selectedNote 
          ? { ...note, title, content, date: new Date().toISOString().split('T')[0] } 
          : note
      ));
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        title,
        content,
        date: new Date().toISOString().split('T')[0],
      };
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote.id);
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (!selectedNote) return;
    
    setNotes(notes.filter(note => note.id !== selectedNote));
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Заметки</h2>
        
        <button 
          onClick={handleNewNote}
          className="bg-primary text-white p-2 rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[70vh] overflow-auto">
          <h3 className="font-medium mb-3">Список заметок</h3>
          
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нет заметок. Создайте новую!
            </div>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <button 
                    onClick={() => handleSelectNote(note.id)}
                    className={`w-full text-left p-3 rounded-lg ${
                      selectedNote === note.id 
                        ? "bg-primary/10 border border-primary" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="font-medium">{note.title}</div>
                    <div className="text-xs text-gray-500">{note.date}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[70vh] flex flex-col">
          {!selectedNote && !isEditing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="mt-2">Выберите заметку или создайте новую</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название заметки"
                    className="text-lg font-medium w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-primary"
                  />
                ) : (
                  <h3 className="text-lg font-medium">{title}</h3>
                )}
                
                <div className="flex space-x-2">
                  {isEditing ? (
                    <button 
                      onClick={handleSave}
                      className="p-2 text-primary hover:bg-primary/10 rounded"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                  
                  {selectedNote && (
                    <button 
                      onClick={handleDelete}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Содержание заметки..."
                    className="w-full h-full p-2 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  ></textarea>
                ) : (
                  <div className="h-full overflow-auto whitespace-pre-wrap">
                    {content}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
