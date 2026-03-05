import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MethodologySection } from "@/components/landing/methodology-section";
import { IndustriesSection } from "@/components/landing/industries-section";
import { PricingSection } from "@/components/landing/pricing-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CapabilitiesSection />
      <HowItWorksSection />
      <MethodologySection />
      <IndustriesSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
