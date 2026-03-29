import { useEffect } from "react";
import CustomerSection from "../components/CustomerSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import JoinUsSection from "../components/JoinUsSection";
import RiderSection from "../components/RiderSection";
import VendorSection from "../components/VendorSection";
import FAQSection from "../components/FAQSection";
import TaglineStrip from "../components/TaglineStrip";
import CoverageSection from "../components/CoverageSection";
import { useLocation } from "react-router-dom";

export default function HomePage() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const attemptScroll = () => {
        const sectionId = location.hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          const headerOffset = 80;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        } else {
          setTimeout(attemptScroll, 50);
        }
      };
      setTimeout(attemptScroll, 100);
    }
  }, [location.hash]);

  return (
    <div className="bg-[#ECFFED] overflow-x-hidden">
      <Header />
      <HeroSection />
      <TaglineStrip />
      <CustomerSection />
      <CoverageSection />
      <VendorSection />
      <RiderSection />
      <JoinUsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
