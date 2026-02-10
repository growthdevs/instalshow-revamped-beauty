import { motion } from "framer-motion";
import { Play } from "lucide-react";

const Videos = () => {
  return (
    <section id="instalcast" className="section-padding bg-off-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold uppercase tracking-widest text-xs">
            Vídeos
          </span>
          <h2 id="instalcast" className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy mt-3">
            Instal Cast
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
            Assista aos depoimentos e veja por que a Instal Show é o evento mais importante do setor
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            { id: "VIDEO_ID_1", title: "Institucional Instal Show" },
            { id: "VIDEO_ID_2", title: "Feedback 2025" },
          ].map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-navy aspect-video shadow-lg hover:shadow-xl transition-shadow duration-300">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-heading font-bold text-navy mt-4 text-center">
                {video.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Videos;
