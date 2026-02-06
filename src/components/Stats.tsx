import { motion } from "framer-motion";
import { Users, Building2, MapPinned } from "lucide-react";
import expoBg from "@/assets/expo-bg.jpg";

const stats = [
  {
    icon: Users,
    number: "3.800+",
    label: "Profissionais",
    description: "Com real poder de decisão",
  },
  {
    icon: Building2,
    number: "300+",
    label: "Empresas",
    description: "Construtoras, Instaladoras, Projetistas, Incorporadoras e Indústrias",
  },
  {
    icon: MapPinned,
    number: "25",
    label: "Estados",
    description: "Representantes de todo o Brasil",
  },
];

const Stats = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${expoBg})` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-navy-dark/90" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Resultados 2025
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-2">
            PÚBLICO INSTAL SHOW
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Números que comprovam o sucesso da maior feira de instalações do Brasil
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-navy-light/30 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full flex flex-col">
                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 mb-6">
                    <stat.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-5xl md:text-6xl font-heading font-black text-white mb-3">
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">
                    {stat.label}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
