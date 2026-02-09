import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Linkedin, Youtube, Facebook, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import logoInstalshow from "@/assets/logo-instalshow.svg";
import expoBg from "@/assets/expo-bg.jpg";

const Footer = () => {
  return (
    <footer id="contato" className="text-white relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${expoBg})` }}
      />
      <div className="absolute inset-0 bg-navy-dark/95" />

      {/* CTA Banner */}
      <div className="relative z-10 border-b border-white/5">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-4">
              Garanta seu espaço na
              <br />
              <span className="text-gradient">InstalShow 2026</span>
            </h2>
            <p className="text-white/50 mb-8 text-base max-w-lg mx-auto">
              Seja um expositor, patrocinador ou visitante. Conecte-se com os maiores profissionais do setor.
            </p>
            <Button variant="hero" size="xl" className="rounded-full group" asChild>
              <a href="https://wa.me/5511963830660" target="_blank" rel="noopener noreferrer">
                Fale com nossa equipe
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={logoInstalshow}
              alt="InstalShow"
              className="h-10 w-auto mb-5"
            />
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              A maior feira de instalações elétricas, hidráulicas, ar condicionado e proteção contra incêndios do Brasil.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, url: "#" },
                { Icon: Linkedin, url: "#" },
                { Icon: Youtube, url: "#" },
                { Icon: Facebook, url: "#" },
              ].map(({ Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-accent/80 transition-all duration-300 text-white/60 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Sobre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-5 text-white/70">Sobre</h4>
            <ul className="space-y-3">
              {["Quem somos", "Nosso Público", "Expositores", "Apoiadores"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Comercial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-5 text-white/70">Comercial</h4>
            <ul className="space-y-3">
              {["Seja um expositor", "Feira virtual", "Patrocínio", "Mídia Kit"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-5 text-white/70">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <a href="tel:+5511963830660" className="text-white/70 hover:text-white transition-colors text-sm">
                    +55 11 96383-0660
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <a href="mailto:atendimento@instalshow.com.br" className="text-white/70 hover:text-white transition-colors text-sm">
                    atendimento@instalshow.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-white/70 text-sm">Arca - São Paulo, SP</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-white/30 text-xs">
              © 2025 InstalShow. Todos os direitos reservados.
            </p>
            <p className="text-white/30 text-xs">
              Powered by{" "}
              <a href="#" className="text-accent/70 hover:text-accent transition-colors">
                Agência Salve
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
