import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  X,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  created_at: string;
  last_sign_in_at: string | null;
};

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
};
const maskCpf = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<AdminUser[]>([]);
  const [selfId, setSelfId] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const call = async (method: string, body?: unknown) => {
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    const res = await fetch(
      `https://trexluryrbqfkfqtexec.supabase.co/functions/v1/admin-users`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      setSelfId(sess.session.user.id);
      const { data: isAdminData } = await supabase.rpc("has_role", {
        _user_id: sess.session.user.id,
        _role: "admin",
      });
      if (!isAdminData) {
        toast({ title: "Acesso negado", description: "Área restrita ao administrador.", variant: "destructive" });
        navigate("/expositor/simulador");
        return;
      }
      await load();
      setLoading(false);
    })();
  }, [navigate]);

  const openCreate = () => {
    setEditing(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setCpf("");
    setModalOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setEmail(u.email);
    setPassword("");
    setName(u.name || "");
    setPhone(u.phone || "");
    setCpf(u.cpf || "");
    setModalOpen(true);
  };

  const submit = async () => {
    if (!email.trim()) {
      toast({ title: "Informe o e-mail", variant: "destructive" });
      return;
    }
    if (!editing && password.length < 6) {
      toast({ title: "Senha deve ter ao menos 6 caracteres", variant: "destructive" });
      return;
    }
    if (!name.trim() || !phone.trim() || !cpf.trim()) {
      toast({ title: "Preencha nome, celular e CPF", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const body: Record<string, string> = { id: editing.id };
        if (email !== editing.email) body.email = email.trim();
        if (password) body.password = password;
        body.name = name.trim();
        body.phone = phone.trim();
        body.cpf = cpf.trim();
        await call("PATCH", body);
        toast({ title: "Administrador atualizado" });
      } else {
        await call("POST", {
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
          cpf: cpf.trim(),
        });
        toast({ title: "Administrador cadastrado" });
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (u: AdminUser) => {
    if (u.id === selfId) {
      toast({ title: "Ação não permitida", description: "Você não pode excluir a si mesmo.", variant: "destructive" });
      return;
    }
    if (!confirm(`Excluir o administrador ${u.email}?`)) return;
    try {
      await call("DELETE", { id: u.id });
      toast({ title: "Administrador excluído" });
      await load();
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
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
              <Users className="w-6 h-6" /> Administradores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} administrador{items.length === 1 ? "" : "es"} cadastrado{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow"
          >
            <Plus className="w-4 h-4" /> Cadastrar administrador
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-primary">Nome</th>
                  <th className="px-4 py-3 font-semibold text-primary">E-mail</th>
                  <th className="px-4 py-3 font-semibold text-primary">Celular</th>
                  <th className="px-4 py-3 font-semibold text-primary">CPF</th>
                  <th className="px-4 py-3 font-semibold text-primary">Último acesso</th>
                  <th className="px-4 py-3 font-semibold text-primary text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Nenhum administrador cadastrado.</td></tr>
                ) : items.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-primary">
                      {u.name || "—"}
                      {u.id === selfId && (
                        <span className="ml-2 text-[10px] uppercase font-semibold text-muted-foreground">(você)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.cpf || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(u.last_sign_in_at)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted mr-2"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => remove(u)}
                        disabled={u.id === selfId}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-tertiary/40 text-tertiary text-xs font-semibold hover:bg-tertiary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-primary">
                {editing ? "Editar administrador" : "Cadastrar administrador"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="admin@empresa.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {editing ? "Nova senha (opcional)" : "Senha"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={editing ? "Deixe em branco para manter" : "Mínimo 6 caracteres"}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Nome completo"
                />
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
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(maskCpf(e.target.value))}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 bg-muted/40 border-t border-border">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
