import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface UserMenuProps {
  /** Exibe o item "Meus dados" (área do expositor) */
  showMeusDados?: boolean;
}

const UserMenu = ({ showMeusDados = true }: UserMenuProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: prof } = await supabase
        .from("expositor_profiles")
        .select("responsible_name, company_name")
        .eq("id", user.id)
        .maybeSingle();
      const metaName =
        (user.user_metadata as { name?: string } | null)?.name ?? "";
      setName(
        prof?.responsible_name || metaName || prof?.company_name || user.email || "Usuário",
      );
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/expositor/login", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu do usuário"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          {getInitials(name || "?")}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="py-3">
          <p className="text-sm font-semibold leading-tight">{name || "—"}</p>
          {email && (
            <p className="text-xs font-normal text-muted-foreground mt-0.5 truncate">{email}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showMeusDados && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/expositor/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Meus dados
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
