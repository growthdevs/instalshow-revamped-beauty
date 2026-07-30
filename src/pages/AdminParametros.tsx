import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  Loader2,
  LogOut,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

type StandRow = {
  id: string;
  name: string;
  price: string;
  description: string;
  sort_order: number;
};

const AdminParametros = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<StandRow[]>([]);

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
      const { data: sp } = await supabase.from("stand_parameters").select("*").order("sort_order");
      setRows(
        (sp ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          price: String(Number(r.price)),
          description: r.description ?? "",
          sort_order: r.sort_order,
        })),
      );
      setLoading(false);
    })();
  }, [navigate]);

  const update = (id: string, field: keyof StandRow, value: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const save = async () => {
    for (const r of rows) {
      if (!r.name.trim()) {
        toast({ title: "Informe o nome de todos os stands", variant: "destructive" });
        return;
      }
      if (!(Number(r.price) >= 0)) {
        toast({ title: "Preço inválido", description: `Verifique o stand ${r.name}.`, variant: "destructive" });
        return;
      }
    }
    setSaving(true);
    try {
      for (const r of rows) {
        const { error } = await supabase
          .from("stand_parameters")
          .update({ name: r.name.trim(), price: Number(r.price), description: r.description.trim() })
          .eq("id", r.id);
        if (error) throw error;
      }
      toast({ title: "Parâmetros salvos", description: "O simulador já reflete os novos valores." });
    } catch (e) {
      toast({ title: "Erro ao salvar", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
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
            <Link to="/admin/expositores" className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <Users className="w-4 h-4" /> Expositores
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

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6" /> Parametrização de vendas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Defina as categorias e os preços de stand exibidos no simulador.
          </p>
        </div>

        <section className="bg-white rounded-2xl border border-border p-5 lg:p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-primary">Categorias de stand</h2>
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-border p-4 grid gap-3 md:grid-cols-[1fr_180px] bg-muted/40">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</label>
                    <input
                      value={r.name}
                      onChange={(e) => update(r.id, "name", e.target.value)}
                      className="mt-1 w-full px-3 py-2.5 rounded-lg bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</label>
                    <input
                      value={r.description}
                      onChange={(e) => update(r.id, "description", e.target.value)}
                      className="mt-1 w-full px-3 py-2.5 rounded-lg bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preço (R$)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={r.price}
                    onChange={(e) => update(r.id, "price", e.target.value)}
                    className="mt-1 w-full px-3 py-2.5 rounded-lg bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {Number(r.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 shadow"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar parâmetros
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminParametros;
