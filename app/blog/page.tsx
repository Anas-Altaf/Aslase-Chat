import Header from '@/components/welcome/Header';
import Footer from '@/components/welcome/Footer';
import BlogSection from '@/components/welcome/BlogSection';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
