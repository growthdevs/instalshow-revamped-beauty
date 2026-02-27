import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Expositores from "@/components/Expositores";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Apoiadores from "@/components/Apoiadores";
import Gallery from "@/components/Gallery";
import Videos from "@/components/Videos";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DroneButton from "@/components/DroneButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Expositores />
      <Stats />
      <About />
      <Apoiadores />
      <Gallery />
      <Videos />
      <Footer />
      <DroneButton />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
