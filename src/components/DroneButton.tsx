import { useState } from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const DroneButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-accent shadow-lg hover:shadow-xl flex items-center justify-center"
        aria-label="Assistir vídeo drone"
      >
        <Video className="w-6 h-6 text-white" />
        <span className="absolute inset-0 rounded-full bg-navy animate-ping opacity-20" />
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-2 bg-black border-none">
          <DialogTitle className="sr-only">Vídeo Drone</DialogTitle>
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_DRONE_ID?autoplay=1"
              title="Vídeo Drone Instal Show"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DroneButton;
