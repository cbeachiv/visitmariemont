import Hero from "@/components/landing/Hero";
import HighlightsSection from "@/components/landing/HighlightsSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HighlightsSection />
      <CommunitySection />
      <Footer />
    </main>
  );
}
