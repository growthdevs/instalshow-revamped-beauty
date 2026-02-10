import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Users, Award, ArrowRight, Zap, Handshake, Presentation } from "lucide-react";
import { Button } from "./ui/button";

const features = [
  { icon: Zap, label: "Networking Qualificado" },
  { icon: Handshake, label: "Negócios B2B" },
  { icon: Presentation, label: "Palestras Técnicas" },
];

const tabs = [
  {
    id: "quem-somos",
    label: "Quem Somos",
    icon: Users,
    title: "A Maior Feira de Instalações do Brasil",
    content: `A Instal Show é o principal ponto de encontro dos profissionais de instalações prediais no Brasil. Reunimos os maiores fabricantes, distribuidores e prestadores de serviços dos segmentos de instalações elétricas, hidráulicas, ar condicionado e proteção contra incêndios.

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
    <section id="sobre" className="section-padding bg-background relative overflow-hidden">
      {/* Subtle mesh background */}
      <div className="absolute inset-0 bg-mesh opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold uppercase tracking-widest text-xs">
            Sobre o Evento
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy mt-3">
            Conheça a Instal Show
          </h2>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-14"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              className="flex items-center gap-2.5 bg-secondary rounded-full px-5 py-3 shadow-card"
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <f.icon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-semibold text-navy">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-navy text-white shadow-lg"
                    : "bg-white text-muted-foreground hover:bg-secondary hover:text-navy shadow-card"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <currentTab.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-navy">
                    {currentTab.title}
                  </h3>
                </div>
              </div>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line pl-16">
                {currentTab.content}
              </div>
              <div className="mt-8 pl-16">
                <Button variant="accent" size="lg" className="rounded-full group" asChild>
                  <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                    Fale Conosco
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
