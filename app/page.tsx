import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import ArtOfCreationSection from "@/components/homepage/ArtOfCreationSection";
import MasterpiecesSection from "@/components/homepage/MasterpiecesSection";
import GallerySection from "@/components/homepage/GallerySection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import CTASection from "@/components/homepage/CTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <ArtOfCreationSection />
        <MasterpiecesSection />
        <GallerySection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
