import { motion } from "framer-motion";

const apoiadores = [
  "https://instalshow.com.br/assets/images/apoiadores/45.webp",
  "https://instalshow.com.br/assets/images/apoiadores/46.webp",
  "https://instalshow.com.br/assets/images/apoiadores/47.webp",
  "https://instalshow.com.br/assets/images/apoiadores/48.webp",
  "https://instalshow.com.br/assets/images/apoiadores/49.webp",
  "https://instalshow.com.br/assets/images/apoiadores/50.webp",
  "https://instalshow.com.br/assets/images/apoiadores/51.webp",
  "https://instalshow.com.br/assets/images/apoiadores/52.webp",
  "https://instalshow.com.br/assets/images/apoiadores/53.webp",
  "https://instalshow.com.br/assets/images/apoiadores/54.webp",
  "https://instalshow.com.br/assets/images/apoiadores/55.webp",
  "https://instalshow.com.br/assets/images/apoiadores/56.webp",
];

const Apoiadores = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold uppercase tracking-widest text-xs">
            Parceiros
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy mt-3">
            Nossos Apoiadores
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
            Entidades e instituições que acreditam no potencial da Instal Show
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 max-w-5xl mx-auto">
          {apoiadores.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            >
              <div className="bg-white rounded-2xl p-5 md:p-6 flex items-center justify-center h-36 md:h-44 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <img
                  src={logo}
                  alt={`Apoiador ${index + 1}`}
                  className="max-w-full max-h-full object-contain transition-all duration-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Apoiadores;
