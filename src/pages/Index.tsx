import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuPreview } from "@/components/MenuPreview";
import { Locations } from "@/components/Locations";
import { FranchiseSection } from "@/components/FranchiseSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <MenuPreview />
        <Locations />
        <FranchiseSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
