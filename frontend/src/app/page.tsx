import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SpecializationsSection } from "@/components/home/SpecializationsSection";
import { TopDoctorsSection } from "@/components/home/TopDoctorsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <SpecializationsSection />
        <TopDoctorsSection />
        <StatsSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}
