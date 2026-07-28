import { useState, useEffect, useCallback } from "react";
import { Menu, ChefHat, LogIn, LogOut } from "lucide-react";
import type { Recipe } from "@/types";
import { getRecipes } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { RecipeList } from "@/components/RecipeList";
import { RecipeDetail } from "@/components/RecipeDetail";
import { LoginModal } from "@/components/LoginModal";

const Index = () => {
  const { isAuthenticated, isChecking, logout } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch {
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFFDF9]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#E8D5C4] bg-[#FFFBF7] shrink-0">
        <div className="flex items-center gap-2.5">
          <ChefHat className="w-6 h-6 text-[#B2503E]" strokeWidth={1.5} />
          <h1 className="font-serif text-xl text-[#5D4E37] font-medium">
            Recipe Journal
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isChecking && (
            isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-[#8B7355] hover:text-[#5D4E37] hover:bg-[#FDF6F0] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-[#B2503E] hover:text-white hover:bg-[#B2503E] transition-colors border border-[#B2503E]/20 hover:border-[#B2503E]"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-[#8B7355] hover:text-[#5D4E37] hover:bg-[#FDF6F0] transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`w-72 border-r border-[#E8D5C4] bg-[#FFFBF7] shrink-0 transition-transform duration-200 overflow-hidden
            ${sidebarOpen ? "fixed inset-y-0 left-0 z-50 mt-[57px]" : "hidden lg:block"}
            lg:static lg:z-auto lg:mt-0`}
        >
          {error ? (
            <div className="p-5 text-center">
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <button
                onClick={loadRecipes}
                className="text-sm text-[#B2503E] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <RecipeList
              recipes={recipes}
              selectedId={selectedRecipe?.id ?? null}
              onSelect={handleSelect}
              loading={loading}
            />
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-[#FFFDF9] overflow-hidden">
          <RecipeDetail
            recipe={selectedRecipe}
            isAuthenticated={isAuthenticated}
            onLoginRequired={() => setLoginOpen(true)}
          />
        </main>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default Index;
