import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Minus,
  Plus,
  MapPin,
  Sparkles,
  MessageCircle,
  Loader2,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

const WHATSAPP_NUMBER = "5511963830660";

const STANDS = [
  {
    id: "bronze",
    name: "Bronze",
    price: 8500,
    color: "from-amber-700 to-amber-500",
    ring: "ring-amber-600/40",
    dot: "bg-amber-600",
    desc: "Localização periférica, ótimo custo-benefício.",
  },
  {
    id: "prata",
    name: "Prata",
    price: 12500,
    color: "from-slate-800 to-slate-500",
    ring: "ring-slate-600/50",
    dot: "bg-slate-600",
    desc: "Posição intermediária, alto fluxo de público.",
  },
  {
    id: "ouro",
    name: "Ouro",
    price: 18500,
    color: "from-yellow-500 to-yellow-300",
    ring: "ring-yellow-500/50",
    dot: "bg-yellow-500",
    desc: "Área nobre, ao centro e próxima ao palco.",
  },
] as const;

const EVENTOS_ADICIONAIS = [
  {
    id: "palestra-1",
    name: "Palestra Patrocinada — Auditório Principal",
    price: 6500,
    desc: "40 minutos no palco principal, com divulgação na grade oficial.",
  },
  {
    id: "palestra-2",
    name: "Palestra Técnica — Sala de Workshops",
    price: 3800,
    desc: "30 minutos de conteúdo técnico em sala reservada.",
  },
] as const;



type Profile = { company_name: string; cnpj: string; email: string };

const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ExpositorSimulador = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [qtd, setQtd] = useState<Record<string, number>>({
    bronze: 0,
    prata: 0,
    ouro: 0,
  });
  const [eventos, setEventos] = useState<Record<string, boolean>>({});
  const [desiredStands, setDesiredStands] = useState("");

  // Admin sale modal
  const [saleOpen, setSaleOpen] = useState(false);
  const [savingSale, setSavingSale] = useState(false);
  const [saleForm, setSaleForm] = useState({
    company_name: "",
    cnpj: "",
    responsible_name: "",
    responsible_email: "",
    negotiated_value: "",
    notes: "",
    sale_date: "",
  });

  useEffect(() => {
    const init = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        navigate("/expositor/login", { replace: true });
        return;
      }
      const [{ data: prof }, { data: roles }] = await Promise.all([
        supabase
          .from("expositor_profiles")
          .select("company_name, cnpj, email")
          .eq("id", userRes.user.id)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userRes.user.id),
      ]);
      setProfile(
        prof ?? { company_name: "-", cnpj: "-", email: userRes.user.email ?? "-" },
      );
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/expositor/login", { replace: true });
  };

  const subtotalStands = useMemo(
    () => STANDS.reduce((sum, s) => sum + s.price * (qtd[s.id] || 0), 0),
    [qtd],
  );
  const subtotalEventos = useMemo(
    () =>
      EVENTOS_ADICIONAIS.filter((e) => eventos[e.id]).reduce(
        (sum, e) => sum + e.price,
        0,
      ),
    [eventos],
  );
  const subtotal = subtotalStands + subtotalEventos;
  const total = subtotal;
  const totalStands = qtd.bronze + qtd.prata + qtd.ouro;

  const inc = (id: string) => setQtd((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const dec = (id: string) =>
    setQtd((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));

  const handleEnviarWhats = () => {
    if (totalStands === 0) {
      toast({
        title: "Selecione ao menos 1 stand",
        description: "Adicione a quantidade desejada para continuar.",
        variant: "destructive",
      });
      return;
    }

    const linhas: string[] = [];
    linhas.push("*Nova simulação — Instal Show 2026*");
    linhas.push("");
    linhas.push(`*Empresa:* ${profile?.company_name ?? "-"}`);
    linhas.push(`*CNPJ:* ${profile?.cnpj ?? "-"}`);
    linhas.push(`*E-mail:* ${profile?.email ?? "-"}`);
    linhas.push("");
    linhas.push("*Stands selecionados:*");
    STANDS.forEach((s) => {
      const q = qtd[s.id] || 0;
      if (q > 0)
        linhas.push(`• ${q}x Stand ${s.name} — ${currency(s.price * q)}`);
    });
    if (desiredStands.trim()) {
      linhas.push(`*Stands desejados:* ${desiredStands.trim()}`);
    }

    const evSel = EVENTOS_ADICIONAIS.filter((e) => eventos[e.id]);
    if (evSel.length) {
      linhas.push("");
      linhas.push("*Eventos adicionais:*");
      evSel.forEach((e) => linhas.push(`• ${e.name} — ${currency(e.price)}`));
    }

    linhas.push("");
    linhas.push(`*Subtotal:* ${currency(subtotal)}`);
    linhas.push(`*Total estimado:* ${currency(total)}`);
    linhas.push("");
    linhas.push("Gostaria de dar continuidade ao atendimento comercial.");

    const msg = encodeURIComponent(linhas.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const openSaleModal = () => {
    if (totalStands === 0) {
      toast({
        title: "Selecione ao menos 1 stand",
        description: "Adicione a quantidade desejada para continuar.",
        variant: "destructive",
      });
      return;
    }
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localIso = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    setSaleForm((s) => ({
      ...s,
      company_name: s.company_name || profile?.company_name || "",
      cnpj: s.cnpj || profile?.cnpj || "",
      responsible_email: s.responsible_email || profile?.email || "",
      negotiated_value: s.negotiated_value || total.toFixed(2),
      sale_date: s.sale_date || localIso,
    }));
    setSaleOpen(true);
  };

  const handleRegistrarVenda = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(saleForm.negotiated_value.replace(",", "."));
    if (
      !saleForm.company_name.trim() ||
      !saleForm.cnpj.trim() ||
      !saleForm.responsible_name.trim() ||
      !saleForm.responsible_email.trim() ||
      !saleForm.sale_date ||
      isNaN(value) ||
      value <= 0
    ) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSavingSale(true);
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) {
      setSavingSale(false);
      return;
    }

    const simulation_data = {
      stands: STANDS.filter((s) => (qtd[s.id] || 0) > 0).map((s) => ({
        id: s.id,
        name: s.name,
        quantity: qtd[s.id],
        unit_price: s.price,
      })),
      eventos: EVENTOS_ADICIONAIS.filter((ev) => eventos[ev.id]).map((ev) => ({
        id: ev.id,
        name: ev.name,
        price: ev.price,
      })),
      desired_stands: desiredStands.trim() || null,
      subtotal,
      simulated_total: total,
    };

    const { error } = await supabase.from("sales").insert({
      created_by: userRes.user.id,
      company_name: saleForm.company_name.trim(),
      cnpj: saleForm.cnpj.trim(),
      responsible_name: saleForm.responsible_name.trim(),
      responsible_email: saleForm.responsible_email.trim(),
      negotiated_value: value,
      notes: saleForm.notes.trim() || null,
      sale_date: new Date(saleForm.sale_date).toISOString(),
      simulation_data,
    });
    setSavingSale(false);

    if (error) {
      toast({ title: "Erro ao registrar venda", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Venda registrada com sucesso!",
      description: `${saleForm.company_name} — ${currency(value)}`,
    });
    setSaleOpen(false);
    setSaleForm({
      company_name: "",
      cnpj: "",
      responsible_name: "",
      responsible_email: "",
      negotiated_value: "",
      notes: "",
      sale_date: "",
    });
    setQtd({ bronze: 0, prata: 0, ouro: 0 });
    setEventos({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-navy-dark/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src={logoInstalshow} alt="Instal Show" className="h-9 w-auto" />
            </Link>
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white bg-tertiary/80 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <Link
                  to="/admin/vendas"
                  className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Relatório de vendas
                </Link>
                <Link
                  to="/admin/administradores"
                  className="hidden md:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" /> Administradores
                </Link>
              </>
            )}
            {!isAdmin && (
              <Link
                to="/expositor/dashboard"
                className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Meus dados
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs uppercase tracking-wider text-primary font-semibold">
            {isAdmin ? "Painel administrativo — Registro de vendas" : "Simulador de Stands"}
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-2">
            {isAdmin
              ? "Monte a simulação e registre a venda"
              : `Monte sua participação, ${profile?.company_name}`}
          </h1>
          <p className="text-foreground/60 mb-8 max-w-2xl">
            {isAdmin
              ? "Selecione stands e eventos, ajuste o valor negociado e registre a venda no sistema."
              : "Escolha seus stands e eventos adicionais. Ao final, envie a simulação diretamente para nossa equipe comercial via WhatsApp."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mapa */}
            <section className="bg-muted border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 p-5 border-b border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="text-foreground font-semibold">Mapa do evento</h2>
              </div>
              <div className="p-4">
                <img
                  src="/mapa-instal.jpeg"
                  alt="Mapa do evento com localização dos stands"
                  loading="lazy"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-xl border border-border"
                />
              </div>
            </section>

            {/* Stands */}
            <section className="bg-muted border border-border rounded-2xl p-5 lg:p-6 shadow-sm">
              <h2 className="text-foreground font-semibold mb-1">
                Seleção de stands
              </h2>
              <p className="text-foreground/50 text-sm mb-5">
                Tamanhos e disposição finais são alinhados pela equipe comercial.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {STANDS.map((s) => (
                  <div
                    key={s.id}
                    className={`relative bg-white border border-foreground/25 rounded-xl p-4 flex flex-col ring-2 ${s.ring}`}
                  >
                    <div
                      className={`h-2.5 w-14 rounded-full bg-gradient-to-r ${s.color} mb-3 shadow-sm ring-1 ring-black/5`}
                    />
                    <div className="text-foreground font-semibold text-lg">
                      Stand {s.name}
                    </div>
                    <div className="text-foreground/50 text-xs mb-3">{s.desc}</div>
                    <div className="text-foreground font-semibold mb-4">
                      {currency(s.price)}
                    </div>
                    <div className="mt-auto flex items-center justify-between bg-white border border-border rounded-full p-1">
                      <button
                        onClick={() => dec(s.id)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors"
                        aria-label={`Diminuir ${s.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-foreground font-semibold w-6 text-center">
                        {qtd[s.id] || 0}
                      </span>
                      <button
                        onClick={() => inc(s.id)}
                        className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors"
                        aria-label={`Aumentar ${s.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-white border border-foreground/25 rounded-xl p-4">
                <label
                  htmlFor="desired-stands"
                  className="block text-foreground font-semibold text-sm mb-1"
                >
                  Informar stands desejados
                </label>
                <p className="text-foreground/50 text-xs mb-3">
                  Informe abaixo os números das posições de stands que deseja reservar. Nossa equipe comercial verificará a disponibilidade e confirmará as opções viáveis.
                </p>
                <input
                  id="desired-stands"
                  type="text"
                  value={desiredStands}
                  onChange={(e) => setDesiredStands(e.target.value)}
                  placeholder="Ex.: 12, 13, 24, 25..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </section>

            {/* Eventos adicionais */}
            <section className="bg-muted border border-border rounded-2xl p-5 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-foreground font-semibold">Eventos adicionais</h2>
              </div>
              <p className="text-foreground/50 text-sm mb-5">
                Amplie sua visibilidade com palestras dentro do evento.
              </p>
              <div className="space-y-3">
                {EVENTOS_ADICIONAIS.map((e) => {
                  const active = !!eventos[e.id];
                  return (
                    <label
                      key={e.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        active
                          ? "bg-accent/5 border-accent/40"
                          : "bg-muted/30 border-border hover:border-foreground/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(ev) =>
                          setEventos((s) => ({ ...s, [e.id]: ev.target.checked }))
                        }
                        className="w-5 h-5 accent-primary"
                      />
                      <div className="flex-1">
                      <div className="text-foreground font-medium">{e.name}</div>
                        <div className="text-foreground/50 text-sm">{e.desc}</div>
                      </div>
                      <div className="text-foreground font-semibold whitespace-nowrap">
                        {currency(e.price)}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right column — Resumo */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-muted border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-foreground font-semibold mb-4">
                Resumo da simulação
              </h2>

              <div className="space-y-3 mb-5">
                {STANDS.map((s) => {
                  const q = qtd[s.id] || 0;
                  if (!q) return null;
                  return (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-foreground/70 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${s.dot} ring-1 ring-black/10`} />
                        {q}x Stand {s.name}
                      </span>
                      <span className="text-foreground font-medium">
                        {currency(s.price * q)}
                      </span>
                    </div>
                  );
                })}
                {EVENTOS_ADICIONAIS.filter((e) => eventos[e.id]).map((e) => (
                  <div key={e.id} className="flex justify-between text-sm">
                    <span className="text-foreground/70 truncate pr-2">
                      {e.name}
                    </span>
                    <span className="text-foreground font-medium whitespace-nowrap">
                      {currency(e.price)}
                    </span>
                  </div>
                ))}
                {totalStands === 0 && !subtotalEventos && (
                  <p className="text-foreground/40 text-sm">
                    Nenhum item selecionado ainda.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-primary font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>{currency(total)}</span>
                </div>
              </div>

              {isAdmin ? (
                <>
                  <button
                    onClick={openSaleModal}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Registrar venda
                  </button>
                  <p className="text-foreground/40 text-xs text-center mt-3">
                    A venda será registrada no sistema para acompanhamento interno.
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEnviarWhats}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar para o comercial
                  </button>
                  <p className="text-foreground/40 text-xs text-center mt-3">
                    A simulação será enviada via WhatsApp para nosso time comercial.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Modal Registrar venda (admin) */}
      {saleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !savingSale && setSaleOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-tertiary" />
                  Registrar venda
                </h3>
                <p className="text-foreground/60 text-sm">
                  Preencha os dados complementares para concluir o registro.
                </p>
              </div>
              <button
                onClick={() => !savingSale && setSaleOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-background flex items-center justify-center text-foreground/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrarVenda} className="p-5 lg:p-6 space-y-4 overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    Nome fantasia *
                  </label>
                  <input
                    type="text"
                    value={saleForm.company_name}
                    onChange={(e) => setSaleForm({ ...saleForm, company_name: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    value={saleForm.cnpj}
                    onChange={(e) => setSaleForm({ ...saleForm, cnpj: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    Nome do responsável *
                  </label>
                  <input
                    type="text"
                    value={saleForm.responsible_name}
                    onChange={(e) => setSaleForm({ ...saleForm, responsible_name: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    E-mail do responsável *
                  </label>
                  <input
                    type="email"
                    value={saleForm.responsible_email}
                    onChange={(e) => setSaleForm({ ...saleForm, responsible_email: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    Valor negociado (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={saleForm.negotiated_value}
                    onChange={(e) => setSaleForm({ ...saleForm, negotiated_value: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                  <p className="text-[11px] text-foreground/50 mt-1">
                    Simulado: {currency(total)} — ajuste conforme a negociação.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    Data e hora da venda *
                  </label>
                  <input
                    type="datetime-local"
                    value={saleForm.sale_date}
                    onChange={(e) => setSaleForm({ ...saleForm, sale_date: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                  Observações da venda
                </label>
                <textarea
                  value={saleForm.notes}
                  onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Itens negociados fora do simulador, condições especiais, etc."
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSaleOpen(false)}
                  disabled={savingSale}
                  className="flex-1 py-3 rounded-xl bg-muted border border-border text-foreground/80 hover:bg-muted/70 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSale}
                  className="flex-1 py-3 rounded-xl bg-success hover:bg-success/90 text-white font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {savingSale ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Confirmar venda
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExpositorSimulador;
