import FAQSection from "../components/contactUs/FAQSection";
import FormSection from "../components/contactUs/FormSection";
import Hero from "../components/contactUs/Hero";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ContactUsPage() {
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
