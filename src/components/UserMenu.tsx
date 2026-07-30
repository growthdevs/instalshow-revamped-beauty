import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
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

const getFirstName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts[0] || "";
};

interface UserMenuProps {
  /** Exibe o item "Meus dados" (área do expositor) */
  showMeusDados?: boolean;
  /** Variante visual do botão */
  variant?: "dark" | "light";
}

const UserMenu = ({ showMeusDados = true, variant = "dark" }: UserMenuProps) => {
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

  const isDark = variant === "dark";
  const firstName = getFirstName(name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu do usuário"
          className={`
            group flex flex-col items-center justify-center gap-0.5
            px-3 py-2 rounded-2xl border transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#052851]
            ${
              isDark
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 focus:ring-white/40"
                : "bg-[#052851]/5 border-[#052851]/10 text-[#052851] hover:bg-[#052851]/10 hover:border-[#052851]/30 focus:ring-[#052851]/30"
            }
          `}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold tracking-wide
                ${isDark ? "bg-white/20 text-white" : "bg-[#052851] text-white"}
              `}
            >
              {getInitials(name || "?")}
            </span>
            <ChevronDown
              className={`
                w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180
                ${isDark ? "text-white/70" : "text-[#052851]/70"}
              `}
            />
          </div>
          <div className="text-center leading-tight">
            <span className={`block text-[10px] font-medium ${isDark ? "text-white/70" : "text-[#052851]/70"}`}>
              Bem-vindo
            </span>
            <span className={`block text-xs font-semibold truncate max-w-[110px] ${isDark ? "text-white" : "text-[#052851]"}`}>
              {firstName || "Usuário"}
            </span>
          </div>
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
