import { motion } from "framer-motion";

const expositores = [
  "https://instalshow.com.br/assets/images/expositores/8.webp",
  "https://instalshow.com.br/assets/images/expositores/9.webp",
  "https://instalshow.com.br/assets/images/expositores/10.webp",
  "https://instalshow.com.br/assets/images/expositores/11.webp",
  "https://instalshow.com.br/assets/images/expositores/12.webp",
  "https://instalshow.com.br/assets/images/expositores/13.webp",
  "https://instalshow.com.br/assets/images/expositores/14.webp",
  "https://instalshow.com.br/assets/images/expositores/16.webp",
  "https://instalshow.com.br/assets/images/expositores/17.webp",
  "https://instalshow.com.br/assets/images/expositores/18.webp",
  "https://instalshow.com.br/assets/images/expositores/19.webp",
  "https://instalshow.com.br/assets/images/expositores/20.webp",
  "https://instalshow.com.br/assets/images/expositores/21.webp",
  "https://instalshow.com.br/assets/images/expositores/22.webp",
  "https://instalshow.com.br/assets/images/expositores/23.webp",
  "https://instalshow.com.br/assets/images/expositores/24.webp",
];

const Expositores = () => {
  return (
    <section id="expositores" className="py-20 bg-off-white overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Empresas Confirmadas
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-navy mt-2">
            EXPOSITORES 2026
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Grandes marcas do setor já confirmaram presença na maior feira de instalações do Brasil
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-off-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-off-white to-transparent z-10" />

        {/* Marquee */}
        <div className="flex animate-marquee">
          {[...expositores, ...expositores].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-6 md:mx-8 flex items-center justify-center"
            >
              <div className="w-32 h-20 md:w-40 md:h-24 bg-white rounded-lg shadow-sm p-4 flex items-center justify-center hover:shadow-md transition-shadow duration-300">
                <img
                  src={logo}
                  alt={`Expositor ${index + 1}`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expositores;
