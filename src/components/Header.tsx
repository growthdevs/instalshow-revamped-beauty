import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import logoInstalshow from "@/assets/logo-instalshow.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [contentOpen, setContentOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { label: "Institucional", href: "#sobre" },
    { label: "Expositores", href: "#expositores" },
    { label: "Agenda", href: "#agenda" },
    { label: "Galeria", href: "#galeria" },
    { label: "Palestrantes", href: "#palestrantes" },
    { label: "Contato", href: "#contato" },
    { label: "Calculadora", href: "https://calculadora.instalshow.com.br", external: true },
  ];

  const contentLinks = [
    { label: "Instal Cast", href: "#instalcast" },
    { label: "Feira Virtual", href: "/feira-virtual" },
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
                className="relative px-3 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full group-hover:w-6 transition-all duration-300" />
              </motion.a>
            ))}

            {/* Conteúdo Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setContentOpen(true)}
              onMouseLeave={() => setContentOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-3 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors duration-300 group">
                Conteúdo
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${contentOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full group-hover:w-6 transition-all duration-300" />
              </button>
              <AnimatePresence>
                {contentOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 mt-2 min-w-[180px] bg-navy-dark/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {contentLinks.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {c.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Language + CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold px-3 py-2 rounded-full hover:bg-white/10"
              aria-label="Toggle language"
            >
              <span className="text-base leading-none">{lang === "pt" ? "🇧🇷" : "🇺🇸"}</span>
              {lang === "pt" ? "PT" : "EN"}
            </button>
            <motion.a
              href="/expositor/login"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-shadow overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              <LogIn className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Área do Expositor</span>
            </motion.a>
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
              {[...navLinks, ...contentLinks].map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="text-white/80 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="/expositor/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-full bg-accent text-white text-sm font-semibold shadow-lg shadow-accent/30"
              >
                <LogIn className="w-4 h-4" />
                Área do Expositor
              </a>
              <button
                onClick={toggleLang}
                className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold py-2.5 mt-2 rounded-full border border-white/10 hover:bg-white/5"
              >
                <span className="text-base leading-none">{lang === "pt" ? "🇧🇷" : "🇺🇸"}</span>
                {lang === "pt" ? "Português" : "English"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
