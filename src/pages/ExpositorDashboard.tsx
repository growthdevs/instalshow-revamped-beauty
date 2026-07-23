import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Building2,
  Mail,
  FileText,
  KeyRound,
  Loader2,
  ArrowLeft,
  Save,
  User,
  Phone,
  ClipboardList,
  Package,
  Sparkles,
  Percent,
  Info,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

type Profile = {
  company_name: string;
  cnpj: string;
  email: string;
  responsible_name: string | null;
  phone: string | null;
};

type Pending = {
  id: string;
  code: string;
  created_at: string;
  simulation_data: any;
};

type Sale = {
  id: string;
  status: string;
  simulation_data: any;
};

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
      [a && `(${a}`, a && a.length === 2 ? ") " : "", b, c && `-${c}`].filter(Boolean).join(""),
    );
  }
  return d.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_META: Record<string, { label: string; cls: string }> = {
  em_analise: { label: "Em análise", cls: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  aguardando_assinatura: {
    label: "Aguardando assinatura",
    cls: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  },
  contrato_assinado: {
    label: "Contrato assinado",
    cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  },
  rejeitado: { label: "Rejeitado", cls: "bg-red-500/15 text-red-700 border-red-500/30" },
};

const ExpositorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"dados" | "historico">("dados");

  // form
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  // history
  const [pendings, setPendings] = useState<Pending[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingHist, setLoadingHist] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        navigate("/expositor/login", { replace: true });
        return;
      }
      const { data } = await supabase
        .from("expositor_profiles")
        .select("company_name, cnpj, email, responsible_name, phone")
        .eq("id", userRes.user.id)
        .maybeSingle();
      const p: Profile =
        data ?? {
          company_name: "-",
          cnpj: "-",
          email: userRes.user.email ?? "-",
          responsible_name: null,
          phone: null,
        };
      setProfile(p);
      setPhone(p.phone ?? "");
      setEmail(p.email ?? "");
      setLoading(false);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (tab !== "historico" || !profile) return;
    const load = async () => {
      setLoadingHist(true);
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) return;
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase
          .from("pending_simulations")
          .select("id, code, created_at, simulation_data")
          .eq("created_by", userRes.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("sales")
          .select("id, status, simulation_data")
          .eq("cnpj", profile.cnpj),
      ]);
      setPendings((p as Pending[]) || []);
      setSales((s as Sale[]) || []);
      setLoadingHist(false);
    };
    load();
  }, [tab, profile]);

  const salesByCode = useMemo(() => {
    const map = new Map<string, Sale>();
    sales.forEach((s) => {
      const c = s.simulation_data?.code;
      if (c) map.set(String(c), s);
    });
    return map;
  }, [sales]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/expositor/login", { replace: true });
  };

  const handleSavePhone = async () => {
    if (!profile) return;
    setSavingProfile(true);
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) return;
    const { error } = await supabase
      .from("expositor_profiles")
      .update({ phone })
      .eq("id", userRes.user.id);
    setSavingProfile(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setProfile({ ...profile, phone });
    toast({ title: "Celular atualizado" });
  };

  const handleSaveEmail = async () => {
    if (!email.trim() || email === profile?.email) return;
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setSavingEmail(false);
    if (error) {
      toast({ title: "Erro ao atualizar e-mail", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Confirmação enviada",
      description: "Enviamos um link de confirmação para o novo e-mail.",
    });
  };

  const handleSavePassword = async () => {
    if (password.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo de 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== password2) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPass(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setPassword("");
    setPassword2("");
    toast({ title: "Senha atualizada com sucesso" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark">
      <header className="border-b border-white/10 bg-navy-dark/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <img src={logoInstalshow} alt="Instal Show" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/expositor/simulador"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-10 lg:py-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs uppercase tracking-wider text-accent font-semibold">
            Área do Expositor
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-2">
            Olá, {profile?.company_name}
          </h1>
          <p className="text-white/60 mb-8">Gerencie seus dados e acompanhe suas simulações.</p>

          {/* Tabs */}
          <div className="inline-flex bg-white/[0.04] border border-white/10 rounded-full p-1 mb-6">
            <TabBtn active={tab === "dados"} onClick={() => setTab("dados")} icon={<User className="w-4 h-4" />}>
              Meus dados
            </TabBtn>
            <TabBtn
              active={tab === "historico"}
              onClick={() => setTab("historico")}
              icon={<ClipboardList className="w-4 h-4" />}
            >
              Histórico de pedidos
            </TabBtn>
          </div>

          {tab === "dados" && (
            <div className="space-y-6">
              {/* Dados da empresa (read-only) */}
              <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-white mb-6">Dados da empresa</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoRow icon={<Building2 className="w-4 h-4" />} label="Empresa" value={profile?.company_name} />
                  <InfoRow icon={<FileText className="w-4 h-4" />} label="CNPJ" value={profile?.cnpj} />
                  <InfoRow
                    icon={<User className="w-4 h-4" />}
                    label="Responsável"
                    value={profile?.responsible_name || "-"}
                  />
                </div>
              </section>

              {/* Editáveis */}
              <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-white mb-6">Contato</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FieldEditable
                    label="Celular"
                    icon={<Phone className="w-4 h-4" />}
                    type="tel"
                    value={phone}
                    onChange={(v) => setPhone(formatPhone(v))}
                    onSave={handleSavePhone}
                    saving={savingProfile}
                    disabled={phone === (profile?.phone ?? "")}
                  />
                  <FieldEditable
                    label="E-mail"
                    icon={<Mail className="w-4 h-4" />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    onSave={handleSaveEmail}
                    saving={savingEmail}
                    disabled={!email.trim() || email === profile?.email}
                    hint="Ao alterar, um link de confirmação será enviado para o novo e-mail."
                  />
                </div>
              </section>

              {/* Senha */}
              <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Alterar senha
                </h2>
                <p className="text-white/60 text-sm mb-4">Defina uma nova senha (mínimo 6 caracteres).</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <button
                  onClick={handleSavePassword}
                  disabled={savingPass || !password || !password2}
                  className="mt-4 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {savingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar senha</>}
                </button>
              </section>
            </div>
          )}

          {tab === "historico" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-2xl p-4 text-sm text-white/80">
                <Info className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>Para mais detalhes, entre em contato com o comercial.</span>
              </div>

              {loadingHist ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>
              ) : pendings.length === 0 ? (
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-10 text-center text-white/60">
                  Você ainda não enviou nenhuma simulação.
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendings.map((p) => {
                    const sale = salesByCode.get(p.code);
                    const status = sale?.status ?? "em_analise";
                    const meta = STATUS_META[status] ?? STATUS_META.em_analise;
                    const sim = p.simulation_data || {};
                    const stands: any[] = sim.stands || [];
                    const eventos: any[] = sim.eventos || [];
                    const discount = sim.discount;
                    return (
                      <div
                        key={p.id}
                        className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-accent/40 transition-colors"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                              Código do pedido
                            </div>
                            <div className="text-xl font-bold text-white font-mono">{p.code}</div>
                            <div className="text-xs text-white/50 mt-1">
                              {new Date(p.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${meta.cls}`}>
                            {meta.label}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <Section title="Stands" icon={<Package className="w-4 h-4" />}>
                            {stands.length ? (
                              <ul className="text-sm text-white/80 space-y-1">
                                {stands.map((s) => (
                                  <li key={s.id}>
                                    {s.quantity}x Stand {s.name}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-sm text-white/50">Nenhum</span>
                            )}
                            {sim.desired_stands && (
                              <div className="text-xs text-white/60 mt-2">
                                <span className="text-white/40">Desejados:</span> {sim.desired_stands}
                              </div>
                            )}
                          </Section>

                          <Section title="Eventos adicionais" icon={<Sparkles className="w-4 h-4" />}>
                            {eventos.length ? (
                              <ul className="text-sm text-white/80 space-y-1">
                                {eventos.map((e) => (
                                  <li key={e.id}>• {e.name}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-sm text-white/50">Nenhum</span>
                            )}
                          </Section>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                          {discount?.applied && (
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                              <Percent className="w-4 h-4" />
                              Desconto solicitado: {discount.percentage}%
                            </div>
                          )}
                          <div className="ml-auto text-right">
                            <div className="text-xs text-white/40 uppercase tracking-wider">
                              Valor da simulação
                            </div>
                            <div className="text-xl font-bold text-white">
                              {currency(Number(sim.simulated_total ?? sim.subtotal ?? 0))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const TabBtn = ({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
      active ? "bg-white text-navy-dark" : "text-white/70 hover:text-white"
    }`}
  >
    {icon}
    {children}
  </button>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-1">
      {icon} {label}
    </div>
    <div className="text-white font-medium truncate">{value || "-"}</div>
  </div>
);

const FieldEditable = ({
  label,
  icon,
  type,
  value,
  onChange,
  onSave,
  saving,
  disabled,
  hint,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
  hint?: string;
}) => (
  <div>
    <label className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
      {icon} {label}
    </label>
    <div className="flex gap-2">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60"
      />
      <button
        onClick={onSave}
        disabled={saving || disabled}
        className="px-4 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-40 flex items-center gap-2"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      </button>
    </div>
    {hint && <p className="text-xs text-white/40 mt-2">{hint}</p>}
  </div>
);

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
      {icon} {title}
    </div>
    {children}
  </div>
);

export default ExpositorDashboard;
