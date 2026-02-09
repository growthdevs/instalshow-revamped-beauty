import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/5511963830660"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl flex items-center justify-center group"
      aria-label="Abrir conversa no WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white fill-white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  );
};

export default WhatsAppButton;
