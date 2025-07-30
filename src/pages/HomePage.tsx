import AbokiNaSection from "../components/AbokiNaSection";
import EnyimSection from "../components/EnyimSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import OreMiSection from "../components/OreMiSection";
import TestimonialsSection from "../components/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="bg-[#ECFFED]">
      <Header />
      <HeroSection />
      <EnyimSection />
      <OreMiSection />
      <AbokiNaSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
