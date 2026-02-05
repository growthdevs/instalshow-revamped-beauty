import { motion } from "framer-motion";
import { Play } from "lucide-react";

const Videos = () => {
  return (
    <section className="py-20 bg-off-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Vídeos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-navy mt-2">
            Institucional
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Assista aos depoimentos e veja por que a InstalShow é o evento mais importante do setor
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Video 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-navy aspect-video">
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID_1"
                title="Institucional InstalShow"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-heading font-bold text-navy mt-4 text-center">
              Institucional InstalShow
            </h3>
          </motion.div>

          {/* Video 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-navy aspect-video">
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID_2"
                title="Feedback 2025"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-heading font-bold text-navy mt-4 text-center">
              Feedback 2025
            </h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Videos;
