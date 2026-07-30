import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  LayoutDashboard,
  Loader2,
  LogOut,
  MailCheck,
  Pencil,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

type Expositor = {
  id: string;
  company_name: string;
  cnpj: string;
  email: string;
  responsible_name: string | null;
  phone: string | null;
  created_at: string;
  email_verified: boolean;
  last_sign_in_at: string | null;
};

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
};

const AdminExpositores = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [items, setItems] = useState<Expositor[]>([]);
  const [query, setQuery] = useState("");

  const [editing, setEditing] = useState<Expositor | null>(null);
  const [company, setCompany] = useState("");
  const [responsible, setResponsible] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const call = async (method: string, body?: unknown) => {
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    const res = await fetch(
      `https://trexluryrbqfkfqtexec.supabase.co/functions/v1/admin-expositores`,
      {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
      },
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro na requisição");
    return json;
  };

  const load = async () => {
    try {
      const { items } = await call("GET");
      setItems(items);
    } catch (e) {
      toast({ title: "Erro ao carregar", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/expositor/login");
        return;
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: sess.session.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        toast({ title: "Acesso negado", description: "Área restrita ao administrador.", variant: "destructive" });
        navigate("/expositor/simulador");
        return;
      }
      await load();
      setLoading(false);
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      [i.company_name, i.cnpj, i.email, i.responsible_name ?? ""].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [items, query]);

  const openEdit = (e: Expositor) => {
    setEditing(e);
    setCompany(e.company_name);
    setResponsible(e.responsible_name ?? "");
    setEmail(e.email);
    setPhone(e.phone ?? "");
  };

  const submit = async () => {
    if (!editing) return;
    if (!company.trim() || !email.trim()) {
      toast({ title: "Preencha empresa e e-mail", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await call("PATCH", {
        id: editing.id,
        company_name: company.trim(),
        responsible_name: responsible.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      toast({ title: "Expositor atualizado" });
      setEditing(null);
      await load();
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const verifyEmail = async (id: string) => {
    setVerifying(true);
    try {
      await call("POST", { id, action: "verify_email" });
      toast({ title: "E-mail validado" });
      await load();
      setEditing((cur) => (cur ? { ...cur, email_verified: true } : cur));
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/expositor/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-navy-dark/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><img src={logoInstalshow} alt="Instal Show" className="h-9 w-auto" /></Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white bg-tertiary/80 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" /> Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/vendas" className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Relatório
            </Link>
            <Link to="/admin/parametros" className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Parâmetros
            </Link>
            <Link to="/expositor/simulador" className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Simulador
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
              <Building2 className="w-6 h-6" /> Relatório de expositores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} expositor{filtered.length === 1 ? "" : "es"} cadastrado{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por empresa, CNPJ ou e-mail"
              className="pl-9 pr-3 py-2.5 w-72 max-w-full rounded-full bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-primary">Empresa</th>
                  <th className="px-4 py-3 font-semibold text-primary">CNPJ</th>
                  <th className="px-4 py-3 font-semibold text-primary">Responsável</th>
                  <th className="px-4 py-3 font-semibold text-primary">E-mail</th>
                  <th className="px-4 py-3 font-semibold text-primary">Celular</th>
                  <th className="px-4 py-3 font-semibold text-primary">Último acesso</th>
                  <th className="px-4 py-3 font-semibold text-primary text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Nenhum expositor encontrado.</td></tr>
                ) : filtered.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-primary">{u.company_name}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.cnpj}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.responsible_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {u.email}
                        {u.email_verified ? (
                          <BadgeCheck className="w-4 h-4 text-success" aria-label="E-mail validado" />
                        ) : (
                          <span className="text-[10px] uppercase font-semibold text-tertiary">não validado</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(u.last_sign_in_at)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-primary">Editar expositor</h2>
              <button onClick={() => setEditing(null)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CNPJ (não editável)</label>
                <input
                  value={editing.cnpj}
                  disabled
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome da empresa</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome do responsável</label>
                <input
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${editing.email_verified ? "text-success" : "text-tertiary"}`}>
                    {editing.email_verified ? "E-mail validado" : "E-mail não validado"}
                  </span>
                  <button
                    onClick={() => verifyEmail(editing.id)}
                    disabled={verifying || editing.email_verified}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted disabled:opacity-40"
                  >
                    {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MailCheck className="w-3.5 h-3.5" />}
                    Validar e-mail
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Celular</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 bg-muted/40 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpositores;
