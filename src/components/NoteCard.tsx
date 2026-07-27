import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: number) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const date = new Date(note.date_epoch_seconds * 1000);

  return (
    <div className="bg-[#FFFBF7] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-3">
        <time className="text-xs text-[#C4A88B] font-medium">
          {format(date, "MMMM d, yyyy 'at' h:mm a")}
        </time>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-[#C4A88B] hover:text-[#B2503E] hover:bg-[#B2503E]/8 transition-colors"
            aria-label="Edit note"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg text-[#C4A88B] hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none prose-headings:text-[#5D4E37] prose-p:text-[#5D4E37] prose-a:text-[#B2503E] prose-strong:text-[#5D4E37] prose-li:text-[#5D4E37] prose-code:text-[#B2503E] prose-code:bg-[#FDF6F0] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
        <ReactMarkdown>{note.content_markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
