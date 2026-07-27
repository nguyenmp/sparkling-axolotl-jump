import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Note } from "@/types";

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  initialContent?: string;
  title?: string;
}

export function NoteEditor({ open, onClose, onSave, initialContent = "", title }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (open) setContent(initialContent);
  }, [open, initialContent]);

  if (!open) return null;

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await onSave(content);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-[#E8D5C4]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D5C4]">
          <h3 className="font-serif text-lg text-[#5D4E37] font-medium">
            {title || "New Note"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#C4A88B] hover:text-[#5D4E37] hover:bg-[#FDF6F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[#E8D5C4] px-6">
          <button
            onClick={() => setTab("write")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              tab === "write"
                ? "border-[#B2503E] text-[#B2503E]"
                : "border-transparent text-[#C4A88B] hover:text-[#5D4E37]"
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              tab === "preview"
                ? "border-[#B2503E] text-[#B2503E]"
                : "border-transparent text-[#C4A88B] hover:text-[#5D4E37]"
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === "write" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note in markdown..."
              className="w-full h-full min-h-[300px] p-6 text-sm text-[#5D4E37] placeholder-[#C4A88B] bg-transparent resize-none focus:outline-none leading-relaxed"
              autoFocus
            />
          ) : (
            <div className="p-6 prose prose-sm max-w-none prose-headings:text-[#5D4E37] prose-p:text-[#5D4E37] prose-a:text-[#B2503E] prose-strong:text-[#5D4E37] prose-li:text-[#5D4E37] prose-code:text-[#B2503E] prose-code:bg-[#FDF6F0] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-[#C4A88B] italic">Nothing to preview yet...</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8D5C4] bg-[#FDF6F0]/50">
          <p className="text-xs text-[#C4A88B]">
            Supports <strong>Markdown</strong> formatting
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-[#8B7355] hover:text-[#5D4E37] bg-white border border-[#E8D5C4] rounded-xl hover:bg-[#FDF6F0] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim() || saving}
              className="px-5 py-2.5 text-sm text-white bg-[#B2503E] rounded-xl hover:bg-[#9A4535] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
