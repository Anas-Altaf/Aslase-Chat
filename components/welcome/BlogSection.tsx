'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';

export default function BlogSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const blogPosts = [
    {
      id: 1,
      title: 'How AI Chatbots Are Transforming Customer Service',
      excerpt: 'Discover how artificial intelligence is revolutionizing the way businesses interact with their customers and improve satisfaction rates.',
      author: 'Sarah Johnson',
      date: 'Dec 15, 2024',
      readTime: '5 min read',
      category: 'AI Technology',
      image: '/hero2-img1.png',
    },
    {
      id: 2,
      title: '10 Best Practices for Building Effective Chatbots',
      excerpt: 'Learn the essential strategies and techniques to create chatbots that truly engage users and drive business results.',
      author: 'Michael Chen',
      date: 'Dec 12, 2024',
      readTime: '7 min read',
      category: 'Best Practices',
      image: '/hero2-img2.png',
    },
    {
      id: 3,
      title: 'The Future of Conversational AI in 2025',
      excerpt: 'Explore the upcoming trends and innovations that will shape the conversational AI landscape in the coming year.',
      author: 'Emily Rodriguez',
      date: 'Dec 10, 2024',
      readTime: '6 min read',
      category: 'Industry Trends',
      image: '/hero2-img3.png',
    },
    {
      id: 4,
      title: 'Integrating Chatbots with Your Existing Tech Stack',
      excerpt: 'A comprehensive guide to seamlessly connecting your chatbot with CRM, analytics, and other business tools.',
      author: 'David Kim',
      date: 'Dec 8, 2024',
      readTime: '8 min read',
      category: 'Integration',
      image: '/hero3-img.png',
    },
    {
      id: 5,
      title: 'Measuring Chatbot Success: Key Metrics That Matter',
      excerpt: 'Understand which KPIs to track and how to optimize your chatbot performance based on data-driven insights.',
      author: 'Lisa Anderson',
      date: 'Dec 5, 2024',
      readTime: '5 min read',
      category: 'Analytics',
      image: '/hero2-img1.png',
    },
    {
      id: 6,
      title: 'Creating Personalized User Experiences with AI',
      excerpt: 'Learn how to leverage AI to deliver tailored conversations that resonate with each individual user.',
      author: 'James Wilson',
      date: 'Dec 3, 2024',
      readTime: '6 min read',
      category: 'Personalization',
      image: '/hero2-img2.png',
    },
  ];

  const categories = ['All', 'AI Technology', 'Best Practices', 'Industry Trends', 'Integration', 'Analytics', 'Personalization'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Latest from Our <span className="text-green-500">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and stories about AI chatbots and conversational technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => {
            const isHovered = hoveredCard === post.id;
            
            return (
              <article
                key={post.id}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 cursor-pointer ${
                  isHovered ? 'shadow-2xl -translate-y-2 border-green-300' : 'shadow-md'
                }`}
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-green-600 font-medium text-sm transition-transform duration-300 ${
                      isHovered ? 'translate-x-1' : ''
                    }`}>
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="rounded-full">
            Load More Articles
          </Button>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-green-50 mb-8 max-w-2xl mx-auto">
            Get the latest insights, tips, and updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-green-600 hover:bg-gray-100 rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
