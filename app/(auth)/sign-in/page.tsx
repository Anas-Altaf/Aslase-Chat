'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/shared/auth-layout';
import { PasswordInput } from '@/components/shared/password-input';
import { ForgotPasswordDialog } from '@/components/shared/ForgotPasswordDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required';
    }
    // More strict email validation requiring proper TLD (at least 2 characters)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    setEmailError(validateEmail(email));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setTouched({ email: true, password: true });

    if (emailErr || passwordErr) {
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');
      router.push('/user-dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      router.push('/user-dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to your AslasChat account"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="group">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <div className="mt-2 relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                emailError ? 'text-red-500' : 'text-gray-400 group-focus-within:text-green-500'
              }`} />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="your@email.com"
                className={`pl-11 h-12 transition-all ${
                  emailError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
              />
              {emailError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>
            {emailError && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </p>
            )}
          </div>

          <div className="group">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="mt-2 relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-10 ${
                passwordError ? 'text-red-500' : 'text-gray-400 group-focus-within:text-green-500'
              }`} />
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`pl-11 h-12 transition-all ${
                  passwordError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
              />
            </div>
            {passwordError && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {passwordError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !!emailError || !!passwordError}
            className="w-full h-12 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
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
            onClick={handleGoogleSignIn}
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
                Sign in with Google
              </span>
            )}
          </Button>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </AuthLayout>

      <ForgotPasswordDialog

        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </>
  );
}
