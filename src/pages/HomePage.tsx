import AbokiNaSection from "../components/AbokiNaSection";
import CommunitySection from "../components/CommunitySection";
import EnyimSection from "../components/EnyimSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import OrderSection from "../components/OrderSection";
import OreMiSection from "../components/OreMiSection";
import TestimonialsSection from "../components/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <EnyimSection />
      <OreMiSection />
      <AbokiNaSection />
      <TestimonialsSection />
      <CommunitySection />
      <FAQSection />
      <OrderSection />
      <Footer />
    </>
  );
}
