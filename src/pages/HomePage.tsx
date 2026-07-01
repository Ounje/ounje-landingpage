import { useEffect } from "react";
import CustomerSection from "../components/CustomerSection";
import RiderSection from "../components/RiderSection";
import VendorSection from "../components/VendorSection";
import CoverageSection from "../components/CoverageSection";
import { useLocation } from "react-router-dom";
import GetPromo from "../components/GetPromoCode";
import FAQSection from "../components/contactUs/FAQSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TaglineStrip from "../components/TaglineStrip";
import JoinUsSection from "../components/JoinUsSection";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "OunjeFood | Order Fast. Eat Fresh. Spend Less";
  }, []);

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
      <JoinUsSection />
      <CustomerSection />
      <CoverageSection />
      <VendorSection />
      <RiderSection />
      <GetPromo />
      <FAQSection />
      <Footer />
    </div>
  );
}
