'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.displayName, formData.referredBy);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create account. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Outer container with full screen */}
      <div className="min-h-screen w-full p-6 flex items-center justify-center">
        {/* Inner container with padding, border radius and background */}
        <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Main Content - Two Column Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - Scrollable Form */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 sm:p-10">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Logo */}
                  <div className="flex justify-center">
                    <img src="/AslasChat.jpg" alt="AsLasChat" className="h-50 w-auto" />
                  </div>

                  {/* Header */}
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 text-center">
                      Get started for Free
                    </h2>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Let's create your account by entering below fields
                    </p>
                  </div>
                  
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )} */}
                    
                    <div>
                      <label
                        htmlFor="displayName"
                        className="block text-sm font-semibold text-gray-900"
                      >
                        Full Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="displayName"
                          name="displayName"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.displayName}
                          onChange={handleChange}
                          className="appearance-none block w-full text-black px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
                          placeholder="Your Full Name"
                        />
                      </div>
                    </div>

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
                          value={formData.email}
                          onChange={handleChange}
                          className="appearance-none block w-full px-4 py-3 border text-black  border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
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
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="appearance-none block w-full px-4 text-black  py-3 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
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
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-gray-900"
                      >
                        Confirm Password
                      </label>
                      <div className="mt-2 relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="appearance-none block text-black  w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
                          placeholder="Confirm Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
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
                      <label
                        htmlFor="referredBy"
                        className="block text-sm font-semibold text-gray-900"
                      >
                        Referred By
                      </label>
                      <div className="mt-2">
                        <input
                          id="referredBy"
                          name="referredBy"
                          type="text"
                          autoComplete="text"
                          value={formData.referredBy}
                          onChange={handleChange}
                          className="appearance-none block text-black  w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm bg-gray-50"
                          placeholder="Referral Code or Name (Optional)"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                      >
                        I agree to the{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                          Terms
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </div>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500 dark:text-gray-400">
                            Already have an account?
                            <Link href="/sign-in" className="ml-1 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Log In</Link>
                          </span>
                        </div>
                      </div>

                      
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Space for static image */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 m-6"><img src="/login-signup-img.png"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}
