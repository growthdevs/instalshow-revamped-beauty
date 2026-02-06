import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Linkedin, Youtube, Facebook } from "lucide-react";
import logoInstalshow from "@/assets/logo-instalshow.svg";
import expoBg from "@/assets/expo-bg.jpg";

const Footer = () => {
  return (
    <footer id="contato" className="text-white relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${expoBg})` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-navy-dark/95" />

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <img 
              src={logoInstalshow} 
              alt="InstalShow" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              A maior feira de instalações elétricas, hidráulicas, ar condicionado e proteção contra incêndios do Brasil.
            </p>
            <div className="flex gap-3">
              {[Instagram, Linkedin, Youtube, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
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
            <h4 className="text-lg font-heading font-bold mb-4">Sobre InstalShow</h4>
            <ul className="space-y-3">
              {["Quem somos", "Nosso Público", "Expositores", "Apoiadores"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">
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
            <h4 className="text-lg font-heading font-bold mb-4">Comercial</h4>
            <ul className="space-y-3">
              {["Seja um expositor", "Feira virtual", "Patrocínio", "Mídia Kit"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">
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
            <h4 className="text-lg font-heading font-bold mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-white/70 text-sm block">Telefone</span>
                  <a href="tel:+5511963830660" className="text-white hover:text-accent transition-colors">
                    +55 11 96383-0660
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-white/70 text-sm block">E-mail</span>
                  <a href="mailto:atendimento@instalshow.com.br" className="text-white hover:text-accent transition-colors text-sm">
                    atendimento@instalshow.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-white/70 text-sm block">Local</span>
                  <span className="text-white">Arca - São Paulo, SP</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-white/50 text-sm">
              © Copyright 2025. Todos os direitos reservados.
            </p>
            <p className="text-white/50 text-sm">
              Powered by{" "}
              <a href="#" className="text-accent hover:underline">
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
