import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

type Modulo = {
  start: string;
  end: string;
  title: string;
  bullets: string[];
};

const day25: Modulo[] = [
  {
    start: "08:00",
    end: "10:00",
    title: "Módulo 1",
    bullets: [
      "A nova NBR-5419 (SPDA)",
      "O que muda em relação à revisão anterior",
    ],
  },
  {
    start: "10:45",
    end: "12:30",
    title: "Módulo 2",
    bullets: [
      "Guia de instalações para síndicos, engenheiros, arquitetos e equipes de suprimentos",
      "Erros mais comuns e dicas relevantes",
    ],
  },
  {
    start: "13:30",
    end: "15:30",
    title: "Módulo 3",
    bullets: [
      "Barramentos blindados e cabos elétricos",
      "Especificações, patologias e ações de melhoria do mercado",
    ],
  },
  {
    start: "16:15",
    end: "18:00",
    title: "Módulo 4",
    bullets: [
      "Carregadores veiculares",
      "Legislação, impactos, concessionárias de energia e principais cuidados",
    ],
  },
];

const day26: Modulo[] = [
  {
    start: "08:00",
    end: "10:00",
    title: "Módulo 5",
    bullets: [
      "Sistemas de sprinklers e proteção contra incêndio",
      "Normatização e boas práticas de instalação",
    ],
  },
  {
    start: "10:45",
    end: "12:30",
    title: "Módulo 6",
    bullets: [
      "Projetos de PPCI e AVCB",
      "Aprovações, principais exigências e cases práticos",
    ],
  },
  {
    start: "13:30",
    end: "15:30",
    title: "Módulo 7",
    bullets: [
      "Instalações hidráulicas prediais",
      "Materiais, dimensionamento e eficiência energética",
    ],
  },
  {
    start: "16:15",
    end: "18:00",
    title: "Módulo 8",
    bullets: [
      "Ar condicionado e climatização em edifícios",
      "Tendências, VRF e sustentabilidade",
    ],
  },
];

const Agenda = () => {
  const [tab, setTab] = useState<"25" | "26">("25");
  const modulos = tab === "25" ? day25 : day26;

  return (
    <section id="agenda" className="relative py-24 md:py-32 bg-navy-dark overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-navy-light/10 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-accent uppercase tracking-widest text-xs md:text-sm font-semibold mb-4 block">
            Congresso Técnico 2026
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6">
            Agenda Técnica
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Consulte a agenda completa do evento para não ficar de fora desses debates técnicos de extrema importância para o nosso setor de instalações no Brasil.
          </p>
        </motion.div>

        {/* Day Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="glass rounded-full p-1.5 inline-flex gap-1">
            {(["25", "26"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setTab(d)}
                className={`relative px-6 md:px-8 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors ${
                  tab === d ? "text-white" : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab === d && (
                  <motion.div
                    layoutId="agenda-tab"
                    className="absolute inset-0 bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{d}/06/2026</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Modulos Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto grid gap-4 md:gap-5"
          >
            {modulos.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group glass rounded-2xl p-5 md:p-7 hover:bg-white/[0.06] transition-all border border-white/5 hover:border-accent/30"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Time */}
                  <div className="flex md:flex-col items-center md:items-start gap-2 md:min-w-[140px]">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-white font-heading font-bold text-lg leading-none">
                        {m.start}
                      </div>
                      <div className="text-white/40 text-xs mt-1">até {m.end}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-3">
                      {m.title}
                    </h3>
                    <ul className="space-y-2">
                      {m.bullets.map((b) => (
                        <li key={b} className="text-white/70 text-sm md:text-base leading-relaxed flex gap-2">
                          <span className="text-accent mt-1.5 flex-shrink-0">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-12"
        >
          <Button variant="hero" size="lg" className="rounded-full group" asChild>
            <a
              href="https://www.sympla.com.br/evento/instal-show-3-edicao-2026/3396916"
              target="_blank"
              rel="noopener noreferrer"
            >
              Faça sua inscrição no Congresso Técnico
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Agenda;
