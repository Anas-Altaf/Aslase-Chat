'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useAuth } from '@/contexts/AuthContext';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setEmail('');
      setEmailSent(false);
    }, 300);
  };

  const handleSendAnother = () => {
    setEmailSent(false);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Reset Password</DialogTitle>
        <div className="space-y-6">
          {!emailSent ? (
            <>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                <p className="text-gray-600 mt-2">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Back to sign in
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-gray-600 mt-2">
                  We've sent a password reset link to
                </p>
                <p className="text-green-600 font-semibold mt-1">{email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Didn't receive the email?</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Check your spam or junk folder</li>
                      <li>Make sure you entered the correct email</li>
                      <li>Wait a few minutes and check again</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleSendAnother}
                  variant="outline"
                  className="w-full h-11"
                >
                  Send to different email
                </Button>

                <Button
                  type="button"
                  onClick={handleClose}
                  className="w-full h-11 bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                >
                  Back to sign in
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
