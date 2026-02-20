import Hero from "@/components/landing/Hero";
import HighlightsSection from "@/components/landing/HighlightsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HighlightsSection />
      <TestimonialsSection />
      <CommunitySection />
      <Footer />
    </main>
  );
}
