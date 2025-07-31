import CustomerSection from "../components/CustomerSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import JoinUsSection from "../components/JoinUsSection";
import RiderSection from "../components/RiderSection";
import VendorSection from "../components/VendorSection";

export default function HomePage() {
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
