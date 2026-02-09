import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import expoBg from "@/assets/expo-bg.jpg";

const images = [
  "https://instalshow.com.br/assets/images/galeria/IMG_4598.webp",
  "https://instalshow.com.br/assets/images/galeria/IMG_8723.webp",
  "https://instalshow.com.br/assets/images/galeria/IMG_3721.webp",
  "https://instalshow.com.br/assets/images/banner/banner-5.webp",
  "https://instalshow.com.br/assets/images/galeria/IMG_4598.webp",
  "https://instalshow.com.br/assets/images/galeria/IMG_8723.webp",
  "https://instalshow.com.br/assets/images/galeria/IMG_3721.webp",
  "https://instalshow.com.br/assets/images/banner/banner-5.webp",
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const navigate = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="galeria" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${expoBg})` }}
      />
      <div className="absolute inset-0 bg-navy-dark/92" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold uppercase tracking-widest text-xs">
            Momentos
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white mt-3">
            Galeria de Fotos
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-base">
            Confira os melhores momentos da última edição da InstalShow
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Nav buttons */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth px-2 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="cursor-pointer flex-shrink-0 group"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-2xl w-72 h-72 md:w-80 md:h-80">
                  <img
                    src={image}
                    alt={`Galeria ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                    <span className="glass text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      Ver foto
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors glass rounded-full w-10 h-10 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors glass rounded-full w-12 h-12 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate("next"); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors glass rounded-full w-12 h-12 flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              src={images[selectedImage]}
              alt={`Galeria ${selectedImage + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
