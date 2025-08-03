import { useEffect } from "react";
import FAQSection from "../components/contactUs/FAQSection";
import FormSection from "../components/contactUs/FormSection";
import Hero from "../components/contactUs/Hero";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

export default function ContactUsPage() {
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
      <Hero />
      <FormSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
