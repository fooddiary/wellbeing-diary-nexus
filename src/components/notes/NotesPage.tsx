
import React, { useState, useEffect } from "react";
import { Folder, File, PlusCircle, Trash2, Save, FolderPlus, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NoteType = {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
};

type FolderType = {
  id: string;
  name: string;
  notes: NoteType[];
  expanded?: boolean;
};

const NotesPageComponent = () => {
  const [folders, setFolders] = useState<FolderType[]>([
    {
      id: "folder-1",
      name: "Основные заметки",
      expanded: true,
      notes: [
        { 
          id: "note-1", 
          title: "Цели на неделю", 
          content: "1. Пить больше воды\n2. Есть больше овощей\n3. Контролировать размеры порций", 
          lastModified: new Date()
        },
        { 
          id: "note-2", 
          title: "Рецепт смузи", 
          content: "Банан, шпинат, молоко, лед - все взбить в блендере.", 
          lastModified: new Date(Date.now() - 86400000)
        },
      ]
    },
    {
      id: "folder-2",
      name: "Рецепты",
      notes: [
        { 
          id: "note-3", 
          title: "Полезный завтрак", 
          content: "Овсянка с ягодами и орехами. Залить кипятком и настоять 10 минут.", 
          lastModified: new Date(Date.now() - 172800000)
        }
      ]
    }
  ]);
  
  const [selectedFolder, setSelectedFolder] = useState<string | null>("folder-1");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  
  // Открыть существующую заметку
  const openNote = (folderId: string, noteId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    
    const note = folder.notes.find(n => n.id === noteId);
    if (!note) return;
    
    setSelectedFolder(folderId);
    setSelectedNote(noteId);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsEditingNote(false);
  };
  
  // Создать новую заметку
  const createNewNote = () => {
    if (!selectedFolder) return;
    
    setSelectedNote(null);
    setNoteTitle("");
    setNoteContent("");
    setIsEditingNote(true);
  };
  
  // Сохранить заметку
  const saveNote = () => {
    if (!selectedFolder) return;
    
    const updatedFolders = [...folders];
    const folderIndex = updatedFolders.findIndex(f => f.id === selectedFolder);
    
    if (folderIndex === -1) return;
    
    if (selectedNote) {
      // Обновляем существующую заметку
      const noteIndex = updatedFolders[folderIndex].notes.findIndex(n => n.id === selectedNote);
      if (noteIndex !== -1) {
        updatedFolders[folderIndex].notes[noteIndex] = {
          ...updatedFolders[folderIndex].notes[noteIndex],
          title: noteTitle,
          content: noteContent,
          lastModified: new Date()
        };
      }
    } else {
      // Создаем новую заметку
      const newNote: NoteType = {
        id: `note-${Date.now()}`,
        title: noteTitle,
        content: noteContent,
        lastModified: new Date()
      };
      
      updatedFolders[folderIndex].notes.push(newNote);
      setSelectedNote(newNote.id);
    }
    
    setFolders(updatedFolders);
    setIsEditingNote(false);
  };
  
  // Удалить заметку
  const deleteNote = () => {
    if (!selectedFolder || !selectedNote) return;
    
    const updatedFolders = [...folders];
    const folderIndex = updatedFolders.findIndex(f => f.id === selectedFolder);
    
    if (folderIndex === -1) return;
    
    updatedFolders[folderIndex].notes = updatedFolders[folderIndex].notes.filter(
      note => note.id !== selectedNote
    );
    
    setFolders(updatedFolders);
    setSelectedNote(null);
    setNoteTitle("");
    setNoteContent("");
  };
  
  // Создать новую папку
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FolderType = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      notes: []
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsCreatingFolder(false);
    setSelectedFolder(newFolder.id);
  };
  
  // Удалить папку
  const deleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    if (selectedFolder === folderId) {
      setSelectedFolder(folders.length > 0 ? folders[0].id : null);
      setSelectedNote(null);
    }
  };
  
  // Переключить состояние раскрытия/сворачивания папки
  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, expanded: !folder.expanded } 
        : folder
    ));
  };
  
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Заметки</h1>
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Боковая панель с папками */}
        <div className="w-full md:w-64 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center">
            <h2 className="font-medium">Папки</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreatingFolder(true)}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Форма создания папки */}
          {isCreatingFolder && (
            <div className="p-2 bg-muted/20">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Название папки"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={createFolder}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCreatingFolder(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="overflow-auto flex-1">
            <div className="p-1">
              {folders.map((folder) => (
                <div key={folder.id}>
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                      selectedFolder === folder.id && "bg-gray-100 dark:bg-gray-700"
                    )}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolder(folder.id);
                        }}
                      >
                        {folder.expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <Folder className="h-4 w-4 mr-1" />
                      <span className="text-sm truncate">{folder.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Заметки в папке */}
                  {folder.expanded && selectedFolder === folder.id && (
                    <div className="ml-6">
                      {folder.notes.map((note) => (
                        <div
                          key={note.id}
                          className={cn(
                            "flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                            selectedNote === note.id && "bg-gray-100 dark:bg-gray-700"
                          )}
                          onClick={() => openNote(folder.id, note.id)}
                        >
                          <File className="h-4 w-4 mr-1" />
                          <span className="text-sm truncate">{note.title || "Без названия"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {selectedFolder && (
            <div className="p-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={createNewNote}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Новая заметка
              </Button>
            </div>
          )}
        </div>
        
        {/* Область редактирования заметки */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
          {!selectedFolder ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Выберите папку слева
            </div>
          ) : !selectedNote && !isEditingNote ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              {folders.find(f => f.id === selectedFolder)?.notes.length
                ? "Выберите заметку или создайте новую"
                : "В этой папке пока нет заметок. Создайте новую заметку."}
            </div>
          ) : (
            <>
              <div className="p-3 border-b flex justify-between items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Название заметки"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    disabled={!isEditingNote}
                    className="text-lg font-medium border-none focus-visible:ring-0 px-0"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  {isEditingNote ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingNote(false)}>
                        Отмена
                      </Button>
                      <Button size="sm" onClick={saveNote}>
                        Сохранить
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingNote(true)}>
                        Редактировать
                      </Button>
                      {selectedNote && (
                        <Button variant="outline" size="sm" onClick={deleteNote}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <Textarea
                  placeholder="Начните писать здесь..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  disabled={!isEditingNote}
                  className="min-h-full border-none focus-visible:ring-0 resize-none p-4"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPageComponent;
