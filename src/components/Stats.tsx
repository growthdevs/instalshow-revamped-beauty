import { motion, useInView } from "framer-motion";
import { Users, Building2, MapPinned } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import expoBg from "@/assets/expo-bg.jpg";

const stats = [
  {
    icon: Users,
    number: 3800,
    suffix: "+",
    label: "Profissionais",
    description: "Com real poder de decisão",
  },
  {
    icon: Building2,
    number: 300,
    suffix: "+",
    label: "Empresas",
    description: "Construtoras, Instaladoras, Projetistas e Indústrias",
  },
  {
    icon: MapPinned,
    number: 25,
    suffix: "",
    label: "Estados",
    description: "Representantes de todo o Brasil",
  },
];

const AnimatedCounter = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString("pt-BR")}{suffix}
    </span>
  );
};

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${expoBg})` }}
      />
      <div className="absolute inset-0 bg-navy-dark/92" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold uppercase tracking-widest text-xs">
            Resultados 2025
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white mt-3">
            Público Instal Show
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-base">
            Números que comprovam o sucesso da maior feira de instalações do Brasil
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="glass rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center hover:bg-white/[0.12] transition-all duration-500 group">
                <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="text-5xl md:text-6xl font-heading font-black text-white mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} inView={isInView} />
                </div>
                <h3 className="text-lg font-heading font-bold text-white/90 mb-2">
                  {stat.label}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
