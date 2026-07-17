import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
        animate={{ scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dark overlay to match reference */}
      <div className="absolute inset-0 bg-navy-dark/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/60 via-navy-dark/50 to-navy-dark" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-28 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-10 md:mb-12">
            <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm md:text-[15px] font-medium text-white bg-navy-dark/70 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              3ª Edição • 25 e 26 de Junho 2026
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-heading font-black text-white mb-8 leading-[0.95] tracking-tight"
          >
            FEIRA E
            <br />
            CONGRESSO
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Instalações Elétricas, Hidráulicas, Ar Condicionado e Proteção
            contra Incêndios no Brasil.
          </motion.p>

          {/* Info pill */}
          <motion.div variants={itemVariants} className="mb-16">
            <span className="inline-flex items-center px-6 py-3.5 rounded-full text-sm md:text-base font-medium text-white/90 bg-white/[0.04] border border-white/15 backdrop-blur-md hover:bg-white/[0.08] transition-colors">
              4ª edição 2027 * em breve mais informações
            </span>
          </motion.div>

          {/* Social block */}
          <motion.div variants={itemVariants} className="space-y-5">
            <p className="text-white/50 text-xs md:text-sm uppercase tracking-[0.25em] font-semibold">
              Evento iniciado
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
              Acompanhe nosso evento nas redes sociais
            </h2>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/instalshow_oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-white font-medium hover:bg-accent hover:border-accent transition-all"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-9 border border-white/20 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ height: ["4px", "12px", "4px"], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 bg-white/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
