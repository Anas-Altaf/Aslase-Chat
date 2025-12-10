import Header from '@/components/welcome/Header';
import Hero1 from '@/components/welcome/Hero1';
import Hero2 from '@/components/welcome/Hero2';
import Features from '@/components/welcome/Features';
import Hero3 from '@/components/welcome/Hero3';
import Hero4 from '@/components/welcome/Hero4';
import Hero5 from '@/components/welcome/Hero5';
import Footer from '@/components/welcome/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main>
        <Hero1 />
        <Hero2 />
        <Features />
        <Hero3 />
        <Hero4 />
        <Hero5 />
      </main>
      <Footer />
    </div>
  );
}

