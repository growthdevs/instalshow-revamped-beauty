import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

const schema = z
  .object({
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "As senhas não coincidem", path: ["confirm"] });

const ExpositorResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast({ title: "Verifique os dados", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Senha alterada!", description: "Redirecionando..." });
    setTimeout(() => navigate("/expositor/login", { replace: true }), 1500);
  };

  return (
    <div className="min-h-screen bg-navy-dark relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.2),transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/expositor/login" className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <Link to="/">
          <img src={logoInstalshow} alt="Instal Show" className="h-9 md:h-10 w-auto" />
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10"
        >
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Senha alterada!</h1>
              <p className="text-white/60">Redirecionando para o login...</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Nova senha</h1>
              <p className="text-white/60 mb-8">Defina uma nova senha para acessar sua conta.</p>
              {!ready && (
                <p className="text-sm text-white/50 mb-4">
                  Aguardando link de recuperação... Certifique-se de abrir esta página pelo link enviado no e-mail.
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !ready}
                  className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Alterar senha"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExpositorResetPassword;
