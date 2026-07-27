import { Plus, Loader2, ChefHat } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { Recipe, Note } from "@/types";
import { getNotes, createNote, updateNote, deleteNote } from "@/api";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { EmptyState } from "./EmptyState";

interface RecipeDetailProps {
  recipe: Recipe | null;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setEditingNote(null);
    setEditorOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 py-6 border-b border-[#E8D5C4] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-[#B2503E]" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl text-[#5D4E37] font-medium">
            {recipe.name}
          </h1>
        </div>
        <button
          onClick={openEditor}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#B2503E] text-white rounded-xl hover:bg-[#9A4535] transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
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
            <button
              onClick={openEditor}
              className="px-5 py-2.5 bg-[#B2503E] text-white rounded-xl hover:bg-[#9A4535] transition-colors text-sm font-medium"
            >
              Write your first note
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
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
