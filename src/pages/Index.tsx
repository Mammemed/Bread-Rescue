import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import AvailableBread from "../components/AvailableBread";
// import AIEstimation from "../components/AIEstimation";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <AvailableBread />
        {/* <AIEstimation /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
