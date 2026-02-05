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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Parceiros
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-navy mt-2">
            Nossos Apoiadores
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Entidades e instituições que acreditam no potencial da InstalShow
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {apoiadores.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-off-white rounded-xl p-4 md:p-6 flex items-center justify-center h-24 md:h-28 border border-transparent hover:border-accent/20 hover:shadow-md transition-all duration-300">
                <img
                  src={logo}
                  alt={`Apoiador ${index + 1}`}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
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
