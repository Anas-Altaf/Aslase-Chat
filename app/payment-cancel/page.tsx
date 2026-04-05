'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/welcome/Header';
import Footer from '@/components/welcome/Footer';

export default function PaymentCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-gray-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">
            No charge was made. You can upgrade your plan anytime from the pricing page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/pricing">View Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/user-dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
