import AboutOunje from "../components/aboutUsSection/AboutOunje";
import Hero from "../components/aboutUsSection/Hero";
import JoinTeamSection from "../components/aboutUsSection/JoinTeamSection";
import TeamSection from "../components/aboutUsSection/TeamSection";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutOunje />
      <TeamSection />
      <JoinTeamSection />
      <Footer />
    </>
  );
}
