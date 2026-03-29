const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[\d\s\-+()]{10,}$/;

export function validateEmail(value: string): string {
  if (!value) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
  return '';
}

export function validatePassword(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export function validateStrongPassword(value: string): string {
  const base = validatePassword(value);
  if (base) return base;
  if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
  return '';
}

export function validateDisplayName(value: string): string {
  if (!value.trim()) return 'Full name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateConfirmPassword(value: string, password: string): string {
  if (!value) return 'Please confirm your password';
  if (value !== password) return 'Passwords do not match';
  return '';
}

export function validatePhoneNumber(value: string): string {
  if (!value) return 'Phone number is required';
  if (!PHONE_REGEX.test(value)) return 'Please enter a valid phone number';
  return '';
}

export function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}
