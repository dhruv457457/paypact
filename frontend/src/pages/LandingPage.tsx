import { BentoGridSection } from "../components/Home Modules/BentoGridSection";
import CollaborationSection from "../components/Home Modules/CollaborationSection";
import FaqSection from "../components/Home Modules/FaqSection";
import FeaturesCard from "../components/Home Modules/FeaturesCard";
import Footer from "../components/Home Modules/Footer";
import Hero from "../components/Home Modules/Hero";

function LandingPage() {
  return (
    <>
      <div className="">
        <Hero />
        <BentoGridSection />
        <FeaturesCard />
        <CollaborationSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
