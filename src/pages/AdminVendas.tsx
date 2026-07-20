import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpDown,
  Download,
  Eye,
  Loader2,
  LogOut,
  Save,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

type SimStand = { id: string; name: string; quantity: number; unit_price: number };
type SimEvento = { id: string; name: string; price: number };
type SimulationData = {
  stands?: SimStand[];
  eventos?: SimEvento[];
  first_participation_discount?: number;
  subtotal?: number;
  discount_value?: number;
  simulated_total?: number;
};

type Sale = {
  id: string;
  company_name: string;
  cnpj: string;
  responsible_name: string;
  responsible_email: string;
  negotiated_value: number;
  notes: string | null;
  sale_date: string;
  created_at: string;
  simulation_data: SimulationData | null;
};

type SortKey = "sale_date" | "negotiated_value";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const AdminVendas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);

  const [company, setCompany] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("sale_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const [detailSale, setDetailSale] = useState<Sale | null>(null);
  const [negotiatedInput, setNegotiatedInput] = useState("");
  const [savingNegotiated, setSavingNegotiated] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/expositor/login");
        return;
      }
      const { data: isAdminData } = await supabase.rpc("has_role", {
        _user_id: sess.session.user.id,
        _role: "admin",
      });
      if (!isAdminData) {
        toast({ title: "Acesso negado", description: "Área restrita ao administrador.", variant: "destructive" });
        navigate("/expositor/simulador");
        return;
      }
      const { data, error } = await supabase
        .from("sales")
        .select("id, company_name, cnpj, responsible_name, responsible_email, negotiated_value, notes, sale_date, created_at, simulation_data")
        .order("sale_date", { ascending: false });
      if (error) {
        toast({ title: "Erro ao carregar vendas", description: error.message, variant: "destructive" });
      } else {
        setSales((data as unknown as Sale[]) ?? []);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = company.trim().toLowerCase();
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : null;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : null;
    const list = sales.filter((s) => {
      if (q && !s.company_name.toLowerCase().includes(q) && !s.cnpj.toLowerCase().includes(q)) return false;
      const t = new Date(s.sale_date).getTime();
      if (fromTs !== null && t < fromTs) return false;
      if (toTs !== null && t > toTs) return false;
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === "negotiated_value") return (a.negotiated_value - b.negotiated_value) * dir;
      return (new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()) * dir;
    });
    return list;
  }, [sales, company, from, to, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [company, from, to, sortKey, sortDir]);

  const totalFiltered = filtered.reduce((sum, s) => sum + Number(s.negotiated_value || 0), 0);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const openDetails = (s: Sale) => {
    setDetailSale(s);
    setNegotiatedInput(String(s.negotiated_value).replace(".", ","));
  };

  const closeDetails = () => {
    setDetailSale(null);
    setNegotiatedInput("");
  };

  const handleSaveNegotiated = async () => {
    if (!detailSale) return;
    const value = parseFloat(negotiatedInput.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      toast({ title: "Valor inválido", description: "Informe um valor negociado maior que zero.", variant: "destructive" });
      return;
    }
    setSavingNegotiated(true);
    const { error } = await supabase
      .from("sales")
      .update({ negotiated_value: value })
      .eq("id", detailSale.id);
    setSavingNegotiated(false);
    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      return;
    }
    setSales((list) => list.map((x) => (x.id === detailSale.id ? { ...x, negotiated_value: value } : x)));
    setDetailSale((s) => (s ? { ...s, negotiated_value: value } : s));
    toast({ title: "Valor negociado atualizado" });
  };

  const exportCSV = () => {
    if (!filtered.length) {
      toast({ title: "Nada para exportar", description: "Ajuste os filtros e tente novamente." });
      return;
    }
    const headers = [
      "Data da venda", "Empresa", "CNPJ", "Responsável", "E-mail", "Valor negociado", "Detalhes da venda", "Registrado em",
    ];
    const rows = filtered.map((s) => [
      fmtDate(s.sale_date),
      s.company_name,
      s.cnpj,
      s.responsible_name,
      s.responsible_email,
      String(s.negotiated_value).replace(".", ","),
      (s.notes ?? "").replace(/\r?\n/g, " "),
      fmtDate(s.created_at),
    ]);
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map((c) => esc(String(c))).join(";")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-vendas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const sim = detailSale?.simulation_data ?? null;
  const simStands = sim?.stands ?? [];
  const simEventos = sim?.eventos ?? [];
  const simSubtotal = sim?.subtotal ?? 0;
  const simDiscountPct = sim?.first_participation_discount ?? 0;
  const simDiscountValue = sim?.discount_value ?? 0;
  const simTotal = sim?.simulated_total ?? 0;

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
            <Link to="/admin/administradores" className="hidden md:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Administradores
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
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Relatório de vendas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} venda{filtered.length === 1 ? "" : "s"} • Total {currency(totalFiltered)}
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4 bg-muted rounded-2xl p-4 border border-border">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Empresa / CNPJ</label>
            <div className="mt-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Filtrar por nome ou CNPJ..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">De</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Até</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-primary">
                    <button onClick={() => toggleSort("sale_date")} className="inline-flex items-center gap-1 hover:opacity-80">
                      Data da venda <ArrowUpDown className="w-3.5 h-3.5" />
                      {sortKey === "sale_date" && <span className="text-xs text-muted-foreground">({sortDir})</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-semibold text-primary">Empresa</th>
                  <th className="px-4 py-3 font-semibold text-primary">CNPJ</th>
                  <th className="px-4 py-3 font-semibold text-primary">Responsável</th>
                  <th className="px-4 py-3 font-semibold text-primary text-right">
                    <button onClick={() => toggleSort("negotiated_value")} className="inline-flex items-center gap-1 hover:opacity-80">
                      Valor <ArrowUpDown className="w-3.5 h-3.5" />
                      {sortKey === "negotiated_value" && <span className="text-xs text-muted-foreground">({sortDir})</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-semibold text-primary text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Nenhuma venda encontrada.</td></tr>
                ) : pageItems.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap">{fmtDate(s.sale_date)}</td>
                    <td className="px-4 py-3 font-medium text-primary">{s.company_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.cnpj}</td>
                    <td className="px-4 py-3">
                      <div>{s.responsible_name}</div>
                      <div className="text-xs text-muted-foreground">{s.responsible_email}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary whitespace-nowrap">{currency(Number(s.negotiated_value))}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openDetails(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/40">
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
              >Anterior</button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
              >Próxima</button>
            </div>
          </div>
        </div>
      </main>

      {detailSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeDetails}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-primary">Detalhes da venda</h2>
                <p className="text-xs text-muted-foreground">Registrado em {fmtDate(detailSale.created_at)}</p>
              </div>
              <button onClick={closeDetails} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dados do cliente */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dados do cliente</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Empresa</div>
                    <div className="font-semibold text-foreground">{detailSale.company_name}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">CNPJ</div>
                    <div className="font-semibold text-foreground">{detailSale.cnpj}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Responsável</div>
                    <div className="font-semibold text-foreground">{detailSale.responsible_name}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">E-mail</div>
                    <div className="font-semibold text-foreground break-all">{detailSale.responsible_email}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 sm:col-span-2">
                    <div className="text-xs text-muted-foreground">Data da venda</div>
                    <div className="font-semibold text-foreground">{fmtDate(detailSale.sale_date)}</div>
                  </div>
                </div>
              </section>

              {/* Stands */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Stands selecionados</h3>
                {simStands.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Nenhum stand registrado.</p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    {simStands.map((st, i) => (
                      <div key={st.id + i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border text-sm">
                        <div>
                          <div className="font-medium text-foreground">Stand {st.name}</div>
                          <div className="text-xs text-muted-foreground">{st.quantity}x • {currency(st.unit_price)} un.</div>
                        </div>
                        <div className="font-semibold text-primary">{currency(st.quantity * st.unit_price)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Eventos */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Eventos adicionais</h3>
                {simEventos.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Nenhum evento adicional selecionado.</p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    {simEventos.map((ev, i) => (
                      <div key={ev.id + i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border text-sm">
                        <div className="font-medium text-foreground">{ev.name}</div>
                        <div className="font-semibold text-primary">{currency(ev.price)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Desconto */}
              {simDiscountValue > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Desconto aplicado</h3>
                  <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-lg px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">1ª participação ({simDiscountPct}%)</span>
                    <span className="font-semibold text-success">- {currency(simDiscountValue)}</span>
                  </div>
                </section>
              )}

              {/* Detalhes da venda (notes) */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Detalhes da venda</h3>
                <div className="bg-muted rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap min-h-[3rem]">
                  {detailSale.notes?.trim() || <span className="text-muted-foreground italic">Nenhuma observação registrada.</span>}
                </div>
              </section>

              {/* Totais */}
              <section className="border-t border-border pt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">{currency(simSubtotal)}</span>
                </div>
                {simDiscountValue > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="font-medium text-success">- {currency(simDiscountValue)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                  <span className="font-semibold text-primary">Valor da simulação</span>
                  <span className="text-lg font-bold text-primary">{currency(simTotal)}</span>
                </div>

                <div className="bg-white border-2 border-success/40 rounded-lg p-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Valor negociado
                  </label>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={negotiatedInput}
                        onChange={(e) => setNegotiatedInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-border text-base font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-success/40"
                        placeholder="0,00"
                      />
                    </div>
                    <button
                      onClick={handleSaveNegotiated}
                      disabled={savingNegotiated}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {savingNegotiated ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Salvar valor negociado
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Este é o único campo editável. Os demais dados refletem a simulação original.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVendas;
