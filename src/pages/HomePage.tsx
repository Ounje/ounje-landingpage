import AbokiNaSection from "../components/RiderSection";
import EnyimSection from "../components/CustomerSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import OreMiSection from "../components/VendorSection";
import TestimonialsSection from "../components/JoinUsSection";

export default function HomePage() {
  return (
    <div className="bg-[#ECFFED]">
      <Header />
      <HeroSection />
      {/* <EnyimSection />
      <OreMiSection />
      {/* <AbokiNaSection /> */}
      {/* <TestimonialsSection />  */}
      <Footer />
    </div>
  );
}
