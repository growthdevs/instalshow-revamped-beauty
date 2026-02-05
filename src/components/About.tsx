import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const tabs = [
  {
    id: "quem-somos",
    label: "Quem Somos",
    icon: Users,
    title: "A Maior Feira de Instalações do Brasil",
    content: `A InstalShow é o principal ponto de encontro dos profissionais de instalações prediais no Brasil. Reunimos os maiores fabricantes, distribuidores e prestadores de serviços dos segmentos de instalações elétricas, hidráulicas, ar condicionado e proteção contra incêndios.

Nossa missão é promover negócios, networking e atualização técnica para milhares de profissionais que buscam as melhores soluções do mercado.`,
  },
  {
    id: "objetivo",
    label: "Nosso Objetivo",
    icon: Target,
    title: "Conectando Pessoas e Oportunidades",
    content: `Nosso objetivo é criar um ambiente propício para a geração de negócios qualificados, onde expositores encontram compradores com real poder de decisão e visitantes descobrem as melhores soluções para seus projetos.

Além da feira, oferecemos um congresso técnico com palestras ministradas por especialistas renomados, proporcionando atualização profissional de alto nível.`,
  },
  {
    id: "diferenciais",
    label: "Diferenciais",
    icon: Award,
    title: "Por que Participar?",
    content: `• Público altamente qualificado com poder de decisão
• Networking com os principais players do mercado
• Palestras técnicas com especialistas renomados
• Lançamentos exclusivos de produtos e soluções
• Oportunidades reais de negócios B2B
• Feira virtual para conexões além do evento presencial`,
  },
];

const About = () => {
  const [activeTab, setActiveTab] = useState("quem-somos");
  const currentTab = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section id="sobre" className="py-20 bg-off-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Sobre o Evento
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-navy mt-2">
            Conheça a InstalShow
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-accent"
                    : "bg-white text-navy hover:bg-navy hover:text-white border border-navy/10"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <currentTab.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-navy">
                  {currentTab.title}
                </h3>
              </div>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
                {currentTab.content}
              </div>
              <div className="mt-8">
                <Button variant="accent" size="lg" className="group" asChild>
                  <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                    Fale Conosco
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default About;
