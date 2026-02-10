import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowRight, Globe } from "lucide-react";
import { Button } from "./ui/button";
import logoInstalshow from "@/assets/logo-instalshow.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { label: "Institucional", href: "#sobre" },
    { label: "Expositores", href: "#expositores" },
    { label: "Instal Cast", href: "#instalcast" },
    { label: "Galeria", href: "#galeria" },
    { label: "Calculadora", href: "https://calculadora.instalshow.com.br", external: true },
    { label: "Contato", href: "#contato" },
  ];

  const toggleLang = () => setLang((l) => (l === "pt" ? "en" : "pt"));

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-navy-dark/95 backdrop-blur-xl shadow-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center relative z-10">
            <motion.img
              src={logoInstalshow}
              alt="Instal Show"
              className="h-9 md:h-11 w-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="relative px-4 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full group-hover:w-6 transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* CTA Buttons + Language */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-full hover:bg-white/10"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              {lang === "pt" ? "EN" : "PT"}
            </button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
              <a href="/feira-virtual">
                Feira Virtual
              </a>
            </Button>
            <Button variant="hero" size="sm" className="rounded-full px-6" asChild>
              <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                Seja um Expositor
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2 relative z-10"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-navy-dark/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => !link.external && setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="text-white/80 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-white/10">
                <button
                  onClick={toggleLang}
                  className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium py-2.5 rounded-full border border-white/10 hover:bg-white/5"
                >
                  <Globe className="w-4 h-4" />
                  {lang === "pt" ? "English" : "Português"}
                </button>
                <Button variant="hero-outline" size="sm" className="rounded-full" asChild>
                  <a href="/feira-virtual" onClick={() => setIsMenuOpen(false)}>
                    Feira Virtual
                  </a>
                </Button>
                <Button variant="hero" size="sm" className="rounded-full" asChild>
                  <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                    Seja um Expositor
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
