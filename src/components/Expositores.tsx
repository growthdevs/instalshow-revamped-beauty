import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-15%", "0%"]);

  const row1 = expositores.slice(0, 8);
  const row2 = expositores.slice(8, 16);

  return (
    <section ref={sectionRef} id="expositores" className="section-padding bg-off-white overflow-hidden">
      <div className="container mx-auto px-4 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-accent font-semibold uppercase tracking-widest text-xs">
            Empresas Confirmadas
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy mt-3">
            Expositores 2026
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
            As maiores marcas do setor já confirmaram presença
          </p>
        </motion.div>
      </div>

      {/* Scrolling rows */}
      <div className="space-y-6">
        <motion.div style={{ x: x1 }} className="flex gap-5">
          {[...row1, ...row1, ...row1].map((logo, index) => (
            <div
              key={`r1-${index}`}
              className="flex-shrink-0 w-36 h-24 md:w-44 md:h-28 bg-white rounded-2xl shadow-card p-5 flex items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <img
                src={logo}
                alt={`Expositor ${(index % row1.length) + 1}`}
                className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
              />
            </div>
          ))}
        </motion.div>

        <motion.div style={{ x: x2 }} className="flex gap-5">
          {[...row2, ...row2, ...row2].map((logo, index) => (
            <div
              key={`r2-${index}`}
              className="flex-shrink-0 w-36 h-24 md:w-44 md:h-28 bg-white rounded-2xl shadow-card p-5 flex items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <img
                src={logo}
                alt={`Expositor ${(index % row2.length) + 9}`}
                className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Expositores;
