'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/shared/auth-layout';
import { PasswordInput } from '@/components/shared/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock, Loader2, Phone } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.displayName, formData.referredBy);
      toast.success('Account created successfully!');
      router.push('/user-dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed up with Google!');
      router.push('/user-dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign up with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Get started for Free"
      subtitle="Let's create your account by entering below fields"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="group">
          <Label htmlFor="displayName" className="text-gray-700 font-medium">Full Name</Label>
          <div className="mt-2 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <Input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              value={formData.displayName}
              onChange={handleChange}
              placeholder="John Doe"
              className="pl-11 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <div className="mt-2 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="pl-11 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <div className="mt-2 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors z-10" />
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              className="pl-11 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
          <div className="mt-2 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors z-10" />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="pl-11 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="referredBy" className="text-gray-700 font-medium">Phone Number</Label>
          <div className="mt-2 relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <Input
              id="referredBy"
              name="referredBy"
              type="tel"
              value={formData.referredBy}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="pl-11 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm text-gray-900">
            I agree to the{' '}
            <Link href="/terms" className="text-green-600 hover:text-green-500">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-green-600 hover:text-green-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          variant="outline"
          className="w-full h-12 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          {googleLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </span>
          )}
        </Button>

        <div className="mt-6 text-center">
          <span className="text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Log In
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}
