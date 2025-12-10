'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { useState } from 'react';

export default function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Sparkles,
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses and startups',
      features: [
        '1 AI Chatbot',
        '1,000 messages/month',
        'Basic customization',
        'Email support',
        'Website integration',
        'Basic analytics',
      ],
      color: 'blue',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      price: '$79',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        '5 AI Chatbots',
        '10,000 messages/month',
        'Advanced customization',
        'Priority support',
        'Multi-platform integration',
        'Advanced analytics',
        'Custom branding',
        'API access',
      ],
      color: 'green',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      price: '$299',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Unlimited AI Chatbots',
        'Unlimited messages',
        'Full customization',
        '24/7 dedicated support',
        'All integrations',
        'Enterprise analytics',
        'White-label solution',
        'Custom AI training',
        'SLA guarantee',
        'Dedicated account manager',
      ],
      color: 'purple',
      popular: false,
    },
  ];

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Choose Your <span className="text-green-500">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start building intelligent chatbots today. No credit card required for trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
                  plan.popular
                    ? 'border-green-500 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                } ${isHovered && !plan.popular ? 'transform -translate-y-2' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.color === 'blue' ? 'bg-blue-100' :
                    plan.color === 'green' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      plan.color === 'blue' ? 'text-blue-600' :
                      plan.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-lg">{plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <Link href="/sign-up?plan=${plan.id}">
                    <Button
                      className={`w-full mb-8 transition-all duration-300 ${
                        plan.popular
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      } ${isHovered ? 'scale-105' : ''}`}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 transition-all duration-200"
                        style={{
                          animation: isHovered ? `fadeIn 0.3s ease-out ${index * 0.05}s both` : 'none'
                        }}
                      >
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need a custom plan?</h2>
          <p className="text-gray-600 mb-8">
            Contact our sales team for enterprise solutions tailored to your needs.
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="mailto:sales@aslaschat.ai">
              Contact Sales
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
