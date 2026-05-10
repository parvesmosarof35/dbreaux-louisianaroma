import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlendHero from "@/components/blend/BlendHero";
import AnatomyOfScent from "@/components/blend/AnatomyOfScent";
import PremiumFormulas from "@/components/blend/PremiumFormulas";

export const metadata = {
  title: "Blend Station | Louisianaroma",
  description: "Craft your unique olfactory signature at the Louisianaroma Blend Station.",
};

export default function BlendPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-0">
        <BlendHero />
        <AnatomyOfScent />
        <PremiumFormulas />
      </main>

      <Footer />
    </>
  );
}
