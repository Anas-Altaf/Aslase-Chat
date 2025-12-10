'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Building2, ArrowRight, Crown } from 'lucide-react';
import { useState } from 'react';

export default function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Sparkles,
      price: billingCycle === 'monthly' ? '$29' : '$290',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Perfect for small businesses and startups',
      features: [
        '1 AI Chatbot',
        '1,000 messages/month',
        'Basic customization',
        'Email support',
        'Website integration',
        'Basic analytics',
      ],
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      price: billingCycle === 'monthly' ? '$79' : '$790',
      period: billingCycle === 'monthly' ? '/month' : '/year',
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
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      price: billingCycle === 'monthly' ? '$299' : '$2990',
      period: billingCycle === 'monthly' ? '/month' : '/year',
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
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      popular: false,
    },
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-green-100 to-emerald-100 border border-green-200/50 mb-6">
            <Crown className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Simple Pricing</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Start building intelligent chatbots today. No credit card required for trial.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-gray-100">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === plan.id;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative bg-white rounded-3xl transition-all duration-500 ${plan.popular
                    ? 'border-2 border-green-400 shadow-2xl shadow-green-500/20 scale-[1.02] lg:scale-105'
                    : 'border border-gray-200 shadow-xl hover:shadow-2xl hover:border-green-300'
                  } ${isHovered && !plan.popular ? 'transform -translate-y-3' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-linear-to-br from-green-500 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-green-500/30">
                      <Zap className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.bgGradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${plan.gradient}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-lg">{plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    variant={plan.popular ? 'gradient' : 'outline'}
                    size="lg"
                    className="w-full mb-8 group"
                  >
                    <Link href={`/sign-up?plan=${plan.id}`} className="flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                        style={{
                          opacity: isHovered ? 1 : 0.8,
                          transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                          transition: `all 0.3s ease-out ${index * 0.05}s`,
                        }}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom plan CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">Need a custom plan?</h3>
              <p className="text-gray-400 text-sm">Contact our sales team for enterprise solutions.</p>
            </div>
            <Button asChild variant="glass" size="lg" className="min-w-[150px]">
              <Link href="mailto:sales@aslaschat.ai">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
