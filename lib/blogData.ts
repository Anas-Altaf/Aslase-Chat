export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
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
