import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import logoInstalshow from "@/assets/logo-instalshow.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Quem Somos", href: "#sobre" },
    { label: "Expositores", href: "#expositores" },
    { label: "Galeria", href: "#galeria" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src={logoInstalshow} 
              alt="InstalShow" 
              className="h-10 md:h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="hero-outline" size="sm" asChild>
              <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                Feira Virtual <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                Seja um Expositor <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-dark border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/80 hover:text-white font-medium py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <Button variant="hero-outline" size="sm" asChild>
                  <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                    Feira Virtual
                  </a>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                    Seja um Expositor
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
