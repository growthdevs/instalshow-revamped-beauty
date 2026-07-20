import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowLeft, Building2, Mail, Lock, FileText, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
});

const signupSchema = z.object({
  company_name: z.string().trim().min(2, "Informe o nome da empresa").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  cnpj: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length === 14, "CNPJ deve ter 14 dígitos"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
});

const formatCNPJ = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const ExpositorLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ company_name: "", email: "", cnpj: "", password: "" });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loadingForgot, setLoadingForgot] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/expositor/simulador", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/expositor/simulador", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(loginData);
    if (!parsed.success) {
      toast({ title: "Verifique os dados", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoadingLogin(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoadingLogin(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(signupData);
    if (!parsed.success) {
      toast({ title: "Verifique os dados", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoadingSignup(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/expositor/simulador`,
        data: {
          company_name: parsed.data.company_name,
          cnpj: parsed.data.cnpj.replace(/\D/g, ""),
        },
      },
    });
    setLoadingSignup(false);
    if (error) {
      toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Cadastro realizado!",
      description: "Verifique seu e-mail para confirmar a conta.",
    });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().email().safeParse(forgotEmail.trim());
    if (!parsed.success) {
      toast({ title: "E-mail inválido", variant: "destructive" });
      return;
    }
    setLoadingForgot(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/expositor/reset-password`,
    });
    setLoadingForgot(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "E-mail enviado", description: "Confira sua caixa de entrada." });
    setForgotOpen(false);
    setForgotEmail("");
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 focus:bg-white/[0.08] transition-all";

  return (
    <div className="min-h-screen bg-navy-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.4),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2260%22%20height=%2260%22%3E%3Cpath%20d=%22M0%2059h60M59%200v60%22%20stroke=%22%23fff%22%20stroke-opacity=%22.03%22%20fill=%22none%22/%3E%3C/svg%3E')] opacity-40" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top nav */}
        <div className="container mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
          <Link to="/">
            <img src={logoInstalshow} alt="Instal Show" className="h-9 md:h-10 w-auto" />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 container mx-auto px-4 lg:px-8 py-8 lg:py-12 grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LOGIN */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-center"
          >
            <div className="max-w-md mx-auto w-full">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                <Lock className="w-3.5 h-3.5" /> Área do Expositor
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Entrar na conta</h1>
              <p className="text-white/60 mb-8">Acesse o painel para simular e gerenciar seus stands.</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loadingLogin}
                  className="w-full py-3 rounded-xl bg-white text-navy-dark font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loadingLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
                </motion.button>
              </form>
            </div>
          </motion.section>

          {/* SIGNUP */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-gradient-to-br from-accent/90 via-accent to-accent/70 rounded-3xl p-8 lg:p-10 overflow-hidden flex flex-col justify-center shadow-2xl shadow-accent/20"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-navy-dark/30 blur-3xl" />

            <div className="relative max-w-md mx-auto w-full">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white bg-white/15 backdrop-blur px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Novo por aqui?
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Cadastre sua empresa</h2>
              <p className="text-white/80 mb-6">
                Crie sua conta em segundos e desbloqueie a simulação de stands para a Instal Show 2026.
              </p>

              <div className="grid grid-cols-1 gap-2 mb-6">
                {[
                  "Simule stands em tempo real",
                  "Acompanhe suas negociações",
                  "Acesso antecipado às condições",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-white/95">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSignup} className="space-y-3">
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Nome da empresa"
                    value={signupData.company_name}
                    onChange={(e) => setSignupData({ ...signupData, company_name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="CNPJ"
                    value={signupData.cnpj}
                    onChange={(e) => setSignupData({ ...signupData, cnpj: formatCNPJ(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input
                    type="email"
                    placeholder="E-mail corporativo"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input
                    type="password"
                    placeholder="Crie uma senha (mín. 6 caracteres)"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loadingSignup}
                  className="w-full py-3 rounded-xl bg-navy-dark text-white font-semibold shadow-xl hover:bg-navy-dark/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loadingSignup ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar conta grátis"}
                </motion.button>

                <p className="text-xs text-white/70 text-center pt-1">
                  Ao criar sua conta você concorda com os termos da Instal Show.
                </p>
              </form>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setForgotOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-navy-dark border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">Recuperar senha</h3>
            <p className="text-white/60 text-sm mb-6">Enviaremos um link para redefinir sua senha.</p>
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={inputCls}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingForgot}
                  className="flex-1 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loadingForgot ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar link"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExpositorLogin;
