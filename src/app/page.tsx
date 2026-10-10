import {
  ContactSection,
  FaqSection,
  FeaturesSection,
  HeroSection,
  PricingSection,
} from "@/components/marketing/home-sections";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
      <FaqSection />
    </main>
  );
}
