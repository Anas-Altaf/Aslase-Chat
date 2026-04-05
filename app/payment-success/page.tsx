'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/welcome/Header';
import Footer from '@/components/welcome/Footer';

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your subscription is now active. Start building your AI chatbots right away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/user-dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/user-dashboard/chatbots">Create a Chatbot</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
