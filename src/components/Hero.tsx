import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-overlay" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/50 via-transparent to-navy-dark/80" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <span className="bg-accent/20 text-accent border border-accent/30 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              2ª Edição • Maior Evento do Setor
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-6 leading-tight"
          >
            FEIRA E CONGRESSO
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Instalações Elétricas, Hidráulicas, Ar Condicionado
            <br className="hidden md:block" />
            <span className="text-accent font-medium">e Proteção contra Incêndios</span> no Brasil.
          </motion.p>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10"
          >
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="text-lg md:text-xl font-semibold">25 e 26 de Junho 2026</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-lg md:text-xl font-semibold">Arca - SP</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                Seja um Expositor ou Patrocinador
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
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
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
