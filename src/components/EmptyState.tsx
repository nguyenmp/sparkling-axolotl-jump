import { BookOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-48 h-48 rounded-3xl bg-[#FDF6F0] flex items-center justify-center mb-8 shadow-inner">
        <BookOpen className="w-20 h-20 text-[#C4956A]" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-serif text-[#5D4E37] mb-3">
        Select a recipe
      </h2>
      <p className="text-[#8B7355] max-w-sm leading-relaxed">
        Choose a recipe from the sidebar to view your notes and journal
        entries. Each recipe is a blank page waiting for your story.
      </p>
    </div>
  );
}
