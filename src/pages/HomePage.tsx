import { useEffect } from "react";
import CustomerSection from "../components/CustomerSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import JoinUsSection from "../components/JoinUsSection";
import RiderSection from "../components/RiderSection";
import VendorSection from "../components/VendorSection";
import { useLocation } from "react-router-dom";

export default function HomePage() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      // More aggressive scroll handling for direct page loads
      const attemptScroll = () => {
        const sectionId = location.hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          // Account for fixed header height (approximately 80px)
          const headerOffset = 80;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          // Retry if content isn't loaded yet
          setTimeout(attemptScroll, 50);
        }
      };
      // Small delay to ensure DOM is ready
      setTimeout(attemptScroll, 100);
    }
  }, [location.hash]);
  return (
    <div className="bg-[#ECFFED] overflow-x-hidden">
      <Header />
      <HeroSection />
      <CustomerSection />
      <VendorSection />
      <RiderSection />
      <JoinUsSection />
      <Footer />
    </div>
  );
}
