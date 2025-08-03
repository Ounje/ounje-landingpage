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
        const section = document.getElementById(location.hash.substring(1));
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        } else {
          // Retry if content isn't loaded yet
          setTimeout(attemptScroll, 50);
        }
      };
      attemptScroll();
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
