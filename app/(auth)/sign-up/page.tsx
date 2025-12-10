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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

  return (
    <AuthLayout
      title="Get started for Free"
      subtitle="Let's create your account by entering below fields"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="displayName">Full Name</Label>
          <div className="mt-2">
            <Input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your Full Name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="mt-2">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
            />
          </div>
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your Password"
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          autoComplete="new-password"
        />

        <div>
          <Label htmlFor="referredBy">Referred By</Label>
          <div className="mt-2">
            <Input
              id="referredBy"
              name="referredBy"
              type="text"
              value={formData.referredBy}
              onChange={handleChange}
              placeholder="Referral Code or Name (Optional)"
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
          className="w-full"
          size="lg"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already have an account?
                <Link href="/sign-in" className="ml-1 text-green-600 hover:text-green-500 font-medium">
                  Log In
                </Link>
              </span>
            </div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
