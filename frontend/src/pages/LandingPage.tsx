import { BentoGridSection } from "../components/Home Modules/BentoGridSection";
import FeaturesSection from "../components/Home Modules/FeaturesSection";
import Footer from "../components/Home Modules/Footer";
import Hero from "../components/Home Modules/Hero";

function LandingPage() {
  return (
    <>
      <div className="">
        <Hero />
        <BentoGridSection />
        <FeaturesSection />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
