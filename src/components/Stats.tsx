import { motion } from "framer-motion";
import { Users, Building2, MapPinned } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "3.800+",
    label: "Profissionais",
    description: "Com real poder de decisão",
    image: "https://instalshow.com.br/assets/images/galeria/IMG_4598.webp",
  },
  {
    icon: Building2,
    number: "300+",
    label: "Empresas",
    description: "Construtoras, Instaladoras, Projetistas, Incorporadoras e Indústrias",
    image: "https://instalshow.com.br/assets/images/galeria/IMG_8723.webp",
  },
  {
    icon: MapPinned,
    number: "25",
    label: "Estados",
    description: "Representantes de todo o Brasil",
    image: "https://instalshow.com.br/assets/images/galeria/IMG_3721.webp",
  },
];

const Stats = () => {
  return (
    <section className="py-20 bg-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

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
              <div className="relative rounded-2xl overflow-hidden bg-navy-light/50 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 -mt-16 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                      <stat.icon className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-4xl md:text-5xl font-heading font-black text-white">
                        {stat.number}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-white/60 text-sm">
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
