import { Search, ChefHat } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@/types";

interface RecipeListProps {
  recipes: Recipe[];
  selectedId: number | null;
  onSelect: (recipe: Recipe) => void;
  loading: boolean;
}

export function RecipeList({ recipes, selectedId, onSelect, loading }: RecipeListProps) {
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[#E8D5C4]">
        <div className="flex items-center gap-2.5 mb-4">
          <ChefHat className="w-5 h-5 text-[#B2503E]" strokeWidth={1.5} />
          <h2 className="font-serif text-lg text-[#5D4E37] font-medium">Recipes</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A88B]" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D5C4] bg-[#FFFBF7] text-sm text-[#5D4E37] placeholder-[#C4A88B] focus:outline-none focus:ring-2 focus:ring-[#B2503E]/20 focus:border-[#B2503E]/30 transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-[#FDF6F0] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-[#C4A88B] text-center">
            {search ? "No recipes match your search" : "No recipes yet"}
          </p>
        ) : (
          <div className="py-2">
            {filtered.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe)}
                className={`w-full text-left px-5 py-3 transition-colors text-sm ${
                  selectedId === recipe.id
                    ? "bg-[#B2503E]/10 text-[#B2503E] font-medium border-r-2 border-[#B2503E]"
                    : "text-[#5D4E37] hover:bg-[#FDF6F0] border-r-2 border-transparent"
                }`}
              >
                <div className="truncate">{recipe.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
