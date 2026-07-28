import { useState } from "react";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await login(password.trim());
      setPassword("");
      onOpenChange(false);
    } catch {
      setError("Invalid password. Please try again.");
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
              <KeyRound className="w-5 h-5 text-[#B2503E]" strokeWidth={1.5} />
            </div>
            <DialogTitle className="font-serif text-xl text-[#5D4E37] text-center">
              Sign in
            </DialogTitle>
            <DialogDescription className="text-[#A69485] text-center text-sm">
              Enter the password to edit and manage recipes.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Password"
              autoFocus
              className="h-11 rounded-xl border-[#E8D5C4] bg-white pr-10 text-[#5D4E37] placeholder:text-[#C4B5A5] focus-visible:ring-[#B2503E]/20 focus-visible:border-[#B2503E]/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A69485] hover:text-[#5D4E37] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full h-11 rounded-xl bg-[#B2503E] hover:bg-[#9A4535] text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
