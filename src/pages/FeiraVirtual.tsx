import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Phone, Mail, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Empresa {
  id: number;
  nome: string;
  logo: string;
  produtos: string[];
  telefone?: string;
  email?: string;
  site?: string;
  endereco?: string;
}

const empresas: Empresa[] = [
  {
    id: 1, nome: "Expositor 1", logo: "https://instalshow.com.br/assets/images/expositores/8.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor1.com.br", site: "https://expositor1.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 2, nome: "Expositor 2", logo: "https://instalshow.com.br/assets/images/expositores/9.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor2.com.br", site: "https://expositor2.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 3, nome: "Expositor 3", logo: "https://instalshow.com.br/assets/images/expositores/10.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor3.com.br", site: "https://expositor3.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 4, nome: "Expositor 4", logo: "https://instalshow.com.br/assets/images/expositores/11.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor4.com.br", site: "https://expositor4.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 5, nome: "Expositor 5", logo: "https://instalshow.com.br/assets/images/expositores/12.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor5.com.br", site: "https://expositor5.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 6, nome: "Expositor 6", logo: "https://instalshow.com.br/assets/images/expositores/13.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor6.com.br", site: "https://expositor6.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 7, nome: "Expositor 7", logo: "https://instalshow.com.br/assets/images/expositores/14.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor7.com.br", site: "https://expositor7.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 8, nome: "Expositor 8", logo: "https://instalshow.com.br/assets/images/expositores/16.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor8.com.br", site: "https://expositor8.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 9, nome: "Expositor 9", logo: "https://instalshow.com.br/assets/images/expositores/17.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor9.com.br", site: "https://expositor9.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 10, nome: "Expositor 10", logo: "https://instalshow.com.br/assets/images/expositores/18.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor10.com.br", site: "https://expositor10.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 11, nome: "Expositor 11", logo: "https://instalshow.com.br/assets/images/expositores/19.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor11.com.br", site: "https://expositor11.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 12, nome: "Expositor 12", logo: "https://instalshow.com.br/assets/images/expositores/20.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor12.com.br", site: "https://expositor12.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 13, nome: "Expositor 13", logo: "https://instalshow.com.br/assets/images/expositores/21.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor13.com.br", site: "https://expositor13.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 14, nome: "Expositor 14", logo: "https://instalshow.com.br/assets/images/expositores/22.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor14.com.br", site: "https://expositor14.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 15, nome: "Expositor 15", logo: "https://instalshow.com.br/assets/images/expositores/23.webp",
    produtos: ["Produto A", "Produto B", "Produto C"], telefone: "(11) 1234-5678", email: "contato@expositor15.com.br", site: "https://expositor15.com.br", endereco: "São Paulo, SP",
  },
  {
    id: 16, nome: "Expositor 16", logo: "https://instalshow.com.br/assets/images/expositores/24.webp",
    produtos: ["Produto A", "Produto B"], telefone: "(11) 1234-5678", email: "contato@expositor16.com.br", site: "https://expositor16.com.br", endereco: "São Paulo, SP",
  },
];

const FeiraVirtual = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Empresa | null>(null);

  const filtered = empresas.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-navy-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-semibold uppercase tracking-widest text-xs"
          >
            Conheça os Participantes
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white mt-3"
          >
            Feira Virtual
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 mt-4 max-w-xl mx-auto"
          >
            Explore as empresas presentes na InstalShow e descubra seus produtos e soluções.
          </motion.p>
        </div>
      </section>

      {/* Search */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white shadow-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((empresa, i) => (
              <motion.div
                key={empresa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl shadow-card p-5 flex flex-col items-center justify-between gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-32 md:h-40 flex items-center justify-center w-full">
                  <img
                    src={empresa.logo}
                    alt={empresa.nome}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  className="rounded-full w-full text-xs"
                  onClick={() => setSelected(empresa)}
                >
                  Saiba Mais
                </Button>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">
              Nenhuma empresa encontrada para "{search}".
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Detalhes da empresa</DialogTitle>
            <DialogDescription>Produtos e informações de contato</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="flex flex-col gap-6 min-h-0">
              {/* Logo */}
              <div className="bg-off-white rounded-xl p-8 flex items-center justify-center h-44 shrink-0">
                <img
                  src={selected.logo}
                  alt={selected.nome}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Produtos - scrollable */}
              <div className="min-h-0 flex flex-col">
                <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider shrink-0">Produtos</h4>
                <div className="overflow-y-auto max-h-48 pr-1">
                  <ul className="space-y-1.5">
                    {selected.produtos.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Contato</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {selected.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <span>{selected.telefone}</span>
                    </div>
                  )}
                  {selected.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" />
                      <a href={`mailto:${selected.email}`} className="hover:text-accent transition-colors">{selected.email}</a>
                    </div>
                  )}
                  {selected.site && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" />
                      <a href={selected.site} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{selected.site}</a>
                    </div>
                  )}
                  {selected.endereco && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>{selected.endereco}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default FeiraVirtual;
