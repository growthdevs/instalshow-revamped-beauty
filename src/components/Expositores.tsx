import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const ITEMS_PER_PAGE = { mobile: 4, desktop: 8 };

const Expositores = () => {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const perPage = isMobile ? ITEMS_PER_PAGE.mobile : ITEMS_PER_PAGE.desktop;
  const totalPages = Math.ceil(expositores.length / perPage);

  const prev = useCallback(() => setPage((p) => (p === 0 ? totalPages - 1 : p - 1)), [totalPages]);
  const next = useCallback(() => setPage((p) => (p === totalPages - 1 ? 0 : p + 1)), [totalPages]);

  const currentItems = expositores.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="expositores" className="section-padding bg-off-white overflow-hidden">
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

      <div className="container mx-auto px-4 relative">
        {/* Navigation buttons */}
        <button
          onClick={prev}
          className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-navy hover:bg-accent hover:text-white transition-all duration-300"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={next}
          className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-navy hover:bg-accent hover:text-white transition-all duration-300"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Grid of logos */}
        <div className="mx-8 md:mx-14">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
          >
            {currentItems.map((logo, index) => (
              <div
                key={`expo-${page}-${index}`}
                className="bg-white rounded-2xl shadow-card p-5 flex items-center justify-center h-28 md:h-36 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <img
                  src={logo}
                  alt={`Expositor ${page * perPage + index + 1}`}
                  className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Page indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === page ? "bg-accent w-7" : "bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expositores;
