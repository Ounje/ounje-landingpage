import AboutOunje from "../components/aboutUsSection/AboutOunje";
import Hero from "../components/aboutUsSection/Hero";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function AboutPage() {
  return (
    <div className="bg-[#ECFFED] overflow-x-hidden">
      <Header />
      <Hero />
      <AboutOunje />
      <Footer />
    </div>
  );
}
