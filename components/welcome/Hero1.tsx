import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function Hero1() {
  return (
    <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            Build Smart AI Chatbots for Communication
            <br />
            <span className="text-green-500">Support, Conversion, Retention, Growth</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Give your website, app, or business the power to chat, guide, and convert automatically.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-8">
            <Button asChild variant="outline" size="xl" className="rounded-xl">
              <Link href="/sign-up">
                Start Free Trial
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-800 text-base font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Build your ChatBot</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No Credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
