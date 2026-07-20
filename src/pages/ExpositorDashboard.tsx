import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Building2, Mail, FileText, KeyRound, Loader2, ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoInstalshow from "@/assets/logo-instalshow.svg";

type Profile = { company_name: string; cnpj: string; email: string };

const ExpositorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingPass, setChangingPass] = useState(false);
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        navigate("/expositor/login", { replace: true });
        return;
      }
      const { data } = await supabase
        .from("expositor_profiles")
        .select("company_name, cnpj, email")
        .eq("id", userRes.user.id)
        .maybeSingle();
      setProfile(
        data ?? { company_name: "-", cnpj: "-", email: userRes.user.email ?? "-" },
      );
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/expositor/login", { replace: true });
  };

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    setChangingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setChangingPass(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setNewPass("");
    toast({ title: "Senha alterada com sucesso!" });
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

      <main className="container mx-auto px-4 lg:px-8 py-10 lg:py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs uppercase tracking-wider text-accent font-semibold">Área do Expositor</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-2">
            Olá, {profile?.company_name}
          </h1>
          <p className="text-white/60 mb-10">Em breve você poderá simular e adquirir seus stands por aqui.</p>

          <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 lg:p-8 mb-6">
            <h2 className="text-lg font-semibold text-white mb-6">Dados da empresa</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={<Building2 className="w-4 h-4" />} label="Empresa" value={profile?.company_name} />
              <InfoRow icon={<FileText className="w-4 h-4" />} label="CNPJ" value={profile?.cnpj} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="E-mail" value={profile?.email} />
            </div>
          </section>

          <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Alterar senha
            </h2>
            <p className="text-white/60 text-sm mb-4">Escolha uma nova senha para sua conta.</p>
            <form onSubmit={handleChangePass} className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                placeholder="Nova senha"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 transition-all"
              />
              <button
                type="submit"
                disabled={changingPass}
                className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {changingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : "Alterar"}
              </button>
            </form>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-1">
      {icon} {label}
    </div>
    <div className="text-white font-medium truncate">{value}</div>
  </div>
);

export default ExpositorDashboard;
