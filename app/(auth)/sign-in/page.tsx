'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {toast} from "sonner"

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please try again.");
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 w-full">
      {/* Outer container with full screen */}
      <div className="min-h-screen w-full h-100 p-6 flex items-center justify-center">
        {/* Inner container with padding, border radius and background */}
        <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Main Content - Two Column Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - Scrollable Form */}
            <div className="flex-1 ">
              <div className="p-8 sm:p-10">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Logo */}
                  <div className="flex justify-center">
                    <img src="/AslasChat.jpg" alt="AsLasChat" className="h-50 w-auto" />
                  </div>

                  {/* Header */}
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 text-center">
                      Welcome back
                    </h2>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Sign in to your AslasChat account
                    </p>
                  </div>
                  
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-900"
                      >
                        Email
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="appearance-none block w-full px-4 py-3 border text-black border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
                          placeholder="Your Email"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-900"
                      >
                        Password
                      </label>
                      <div className="mt-2 relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none block w-full px-4 py-3 pr-10 border text-black border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
                          placeholder="Your Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L9.172 9.172m5.656 5.656l1.414-1.414m1.414-5.656l-1.414 1.414M9.172 9.172L7.757 7.757" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </button>
                    </div>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            Don't have an account?
                            <Link href="/sign-up" className="ml-1 text-green-600 hover:text-green-500 font-medium">Sign Up</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Space for static image */}
            <div className="hidden lg:flex flex bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 m-5"><img src="/login-signup-img.png"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}
