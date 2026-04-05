'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/welcome/Header';
import Footer from '@/components/welcome/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string | null;
  readTime: string;
  publishedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/blogs/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((data) => { if (data) setBlog(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 text-gray-500 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}

          {notFound && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Blog post not found.</p>
              <Button onClick={() => router.push('/blog')} className="mt-4">
                Browse All Posts
              </Button>
            </div>
          )}

          {blog && !loading && (
            <article>
              {/* Category badge */}
              <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {blog.category}
              </span>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6">
                {blog.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              </div>

              {/* Cover image */}
              {blog.coverImage && (
                <div className="rounded-2xl overflow-hidden mb-10 shadow-sm">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-72 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back CTA */}
              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <Button
                  onClick={() => router.push('/blog')}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to all posts
                </Button>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
