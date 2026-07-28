import { useState } from "react";
import { ChefHat, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateRecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateRecipeModal({ open, onOpenChange, onCreate }: CreateRecipeModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onCreate(name.trim());
      setName("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl border-[#E8D5C4] bg-[#FFFBF7] p-0 gap-0">
        <div className="p-6 pb-4">
          <DialogHeader className="space-y-1.5 text-left">
            <div className="mx-auto w-11 h-11 rounded-full bg-[#FDF6F0] flex items-center justify-center mb-2">
              <ChefHat className="w-5 h-5 text-[#B2503E]" strokeWidth={1.5} />
            </div>
            <DialogTitle className="font-serif text-xl text-[#5D4E37] text-center">
              New Recipe
            </DialogTitle>
            <DialogDescription className="text-[#A69485] text-center text-sm">
              Give your recipe a name to start journaling.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="e.g. Grandma's Apple Pie"
            autoFocus
            className="h-11 rounded-xl border-[#E8D5C4] bg-white text-[#5D4E37] placeholder:text-[#C4B5A5] focus-visible:ring-[#B2503E]/20 focus-visible:border-[#B2503E]/40"
          />

          {error && (
            <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full h-11 rounded-xl bg-[#B2503E] hover:bg-[#9A4535] text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Recipe"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}