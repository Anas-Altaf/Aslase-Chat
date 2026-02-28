'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/welcome/Header';
import Footer from '@/components/welcome/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('blogPosts');
    if (stored) {
      setBlogs(JSON.parse(stored));
    } else {
      const defaultBlogs = [
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
      ];
      setBlogs(defaultBlogs);
      localStorage.setItem('blogPosts', JSON.stringify(defaultBlogs));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('blogPosts', JSON.stringify(blogs));
    }
  }, [blogs, isLoaded]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: '',
    readTime: '',
    category: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({ title: '', excerpt: '', author: '', readTime: '', category: '', image: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      readTime: blog.readTime,
      category: blog.category,
      image: blog.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(b => b.id !== id));
      toast.success('Blog deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.author) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingBlog) {
      setBlogs(blogs.map(b => b.id === editingBlog.id ? { ...b, ...formData } : b));
      toast.success('Blog updated successfully');
    } else {
      const newBlog: BlogPost = {
        id: Math.max(...blogs.map(b => b.id), 0) + 1,
        ...formData,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setBlogs([...blogs, newBlog]);
      toast.success('Blog created successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900">Manage Blogs</h1>
              <p className="text-gray-600 mt-2">Create, edit, and delete blog posts</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Blog
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-green-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-100">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{blog.author}</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(blog)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(blog.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the blog"
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="e.g., 5 min read"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., AI Technology"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image">Blog Image</Label>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/path/to/image.png or paste URL"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {formData.image && (
                  <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </Button>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
