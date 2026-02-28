import Header from '@/components/welcome/Header';
import Footer from '@/components/welcome/Footer';
import PricingSection from '@/components/welcome/PricingSection';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
