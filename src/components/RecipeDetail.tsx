import { Plus, Loader2, ChefHat, Lock, Pencil } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Recipe, Note } from "@/types";
import { getNotes, createNote, updateNote, deleteNote } from "@/api";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { EmptyState } from "./EmptyState";

interface RecipeDetailProps {
  recipe: Recipe | null;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
  onRecipeRename?: (recipeId: number, newName: string) => Promise<void>;
}

export function RecipeDetail({ recipe, isAuthenticated, onLoginRequired, onRecipeRename }: RecipeDetailProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(recipe?.name ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recipe) {
      setNameValue(recipe.name);
    }
  }, [recipe]);

  useEffect(() => {
    if (editingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingName]);

  const loadNotes = useCallback(async () => {
    if (!recipe) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotes(recipe.id);
      setNotes(data);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [recipe]);

  useEffect(() => {
    if (recipe) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [recipe, loadNotes]);

  if (!recipe) return <EmptyState />;

  const handleRename = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === recipe.name) {
      setNameValue(recipe.name);
      setEditingName(false);
      return;
    }
    try {
      await onRecipeRename?.(recipe.id, trimmed);
    } catch {
      setNameValue(recipe.name);
    }
    setEditingName(false);
  };

  const handleCreate = async (content: string) => {
    const note = await createNote(recipe.id, content);
    setNotes((prev) => [note, ...prev]);
  };

  const handleUpdate = async (content: string) => {
    if (!editingNote) return;
    const updated = await updateNote(editingNote.id, content);
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
    setEditingNote(null);
  };

  const handleDelete = async (noteId: number) => {
    await deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const openEditor = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    setEditingNote(null);
    setEditorOpen(true);
  };

  const openEdit = (note: Note) => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    setEditingNote(note);
    setEditorOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 py-6 border-b border-[#E8D5C4] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <ChefHat className="w-6 h-6 text-[#B2503E] shrink-0" strokeWidth={1.5} />
          {editingName ? (
            <input
              ref={inputRef}
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setNameValue(recipe.name);
                  setEditingName(false);
                }
              }}
              className="font-serif text-2xl text-[#5D4E37] font-medium bg-transparent border-b-2 border-[#B2503E] outline-none min-w-0"
              style={{ width: `${Math.max(nameValue.length + 2, 10)}ch` }}
            />
          ) : (
            <h1 className="font-serif text-2xl text-[#5D4E37] font-medium truncate">
              {recipe.name}
            </h1>
          )}
          {isAuthenticated && !editingName && (
            <button
              onClick={() => setEditingName(true)}
              className="p-1 rounded-lg text-[#C4A88B] hover:text-[#B2503E] hover:bg-[#FDF6F0] transition-colors shrink-0"
              aria-label="Edit recipe name"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
        {isAuthenticated ? (
          <button
            onClick={openEditor}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#B2503E] text-white rounded-xl hover:bg-[#9A4535] transition-colors text-sm font-medium shadow-sm shrink-0 ml-4"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        ) : (
          <button
            onClick={() => onLoginRequired()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#8B7355] border border-[#E8D5C4] hover:border-[#B2503E]/30 hover:text-[#B2503E] hover:bg-[#FDF6F0] transition-colors font-medium shrink-0 ml-4"
          >
            <Lock className="w-3.5 h-3.5" />
            Sign in to write
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#C4A88B] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={loadNotes}
              className="text-sm text-[#B2503E] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#FDF6F0] flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-[#C4956A]" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-[#5D4E37] mb-2">
              No notes yet
            </h3>
            <p className="text-sm text-[#8B7355] max-w-sm mb-5">
              Start journaling about this recipe — jot down tweaks, memories,
              or how it turned out.
            </p>
            {isAuthenticated ? (
              <button
                onClick={openEditor}
                className="px-5 py-2.5 bg-[#B2503E] text-white rounded-xl hover:bg-[#9A4535] transition-colors text-sm font-medium"
              >
                Write your first note
              </button>
            ) : (
              <button
                onClick={() => onLoginRequired()}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#E8D5C4] text-[#8B7355] rounded-xl hover:border-[#B2503E]/30 hover:text-[#B2503E] hover:bg-[#FDF6F0] transition-colors text-sm font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                Sign in to write
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isAuthenticated={isAuthenticated}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <NoteEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={editingNote ? handleUpdate : handleCreate}
        initialContent={editingNote?.content_markdown ?? ""}
        title={editingNote ? "Edit Note" : `New Note — ${recipe.name}`}
      />
    </div>
  );
}