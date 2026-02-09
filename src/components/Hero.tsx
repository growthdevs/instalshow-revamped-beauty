import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="glass rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
      <span className="text-2xl md:text-3xl font-heading font-black text-white">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-white/50 text-xs md:text-sm font-medium uppercase tracking-wider">
      {label}
    </span>
  </div>
);

const Hero = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const eventDate = new Date("2026-06-25T09:00:00-03:00").getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, eventDate - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" as const } },
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

      {/* Multi-layer overlay */}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-navy-dark/60" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-navy-light/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-8">
            <span className="glass inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white/90">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              2ª Edição • 25 e 26 de Junho 2026
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-8xl font-heading font-black text-white mb-4 leading-[0.95] tracking-tight"
          >
            FEIRA E
            <br />
            <span className="text-gradient">CONGRESSO</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Instalações Elétricas, Hidráulicas, Ar Condicionado
            {" "}e Proteção contra Incêndios no Brasil.
          </motion.p>

          {/* Event Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            <div className="flex items-center gap-2.5 glass rounded-full px-5 py-2.5">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm md:text-base font-medium text-white/90">25 e 26 de Junho 2026</span>
            </div>
            <div className="flex items-center gap-2.5 glass rounded-full px-5 py-2.5">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm md:text-base font-medium text-white/90">Arca - São Paulo, SP</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4 sm:px-0">
            <Button variant="hero" size="xl" className="rounded-full group text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14" asChild>
              <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                Seja um Expositor ou Patrocinador
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" className="rounded-full" asChild>
              <a href="#sobre">
                Saiba Mais
              </a>
            </Button>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={itemVariants}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4 font-medium">Faltam</p>
            <div className="flex items-center justify-center gap-3 md:gap-5">
              <CountdownUnit value={countdown.days} label="Dias" />
              <span className="text-white/20 text-2xl font-light mt-[-24px]">:</span>
              <CountdownUnit value={countdown.hours} label="Horas" />
              <span className="text-white/20 text-2xl font-light mt-[-24px]">:</span>
              <CountdownUnit value={countdown.minutes} label="Min" />
              <span className="text-white/20 text-2xl font-light mt-[-24px]">:</span>
              <CountdownUnit value={countdown.seconds} label="Seg" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
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
