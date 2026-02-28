/**
 * Business form validation utilities
 */

export interface BusinessFormData {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  urls: string[];
}

export interface BusinessFormErrors {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  urls: string[];
}

/**
 * Validates business name
 */
export const validateBusinessName = (name: string): string => {
  if (!name.trim()) {
    return 'Business name is required';
  }
  if (name.trim().length < 2) {
    return 'Business name must be at least 2 characters';
  }
  if (name.trim().length > 100) {
    return 'Business name must be less than 100 characters';
  }
  return '';
};

/**
 * Validates business description
 */
export const validateDescription = (description: string): string => {
  if (!description.trim()) {
    return 'Description is required';
  }
  if (description.trim().length < 10) {
    return 'Description must be at least 10 characters';
  }
  if (description.trim().length > 500) {
    return 'Description must be less than 500 characters';
  }
  return '';
};

/**
 * Validates email address
 */
export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Email address is required';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Validates phone number
 */
export const validatePhoneNumber = (phone: string): string => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  if (digitsOnly.length > 15) {
    return 'Phone number is too long';
  }
  return '';
};

/**
 * Validates URL format (optional field)
 */
export const validateUrl = (url: string): string => {
  // URL is optional, so empty is valid
  if (!url.trim()) {
    return '';
  }
  
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must start with http:// or https://';
    }
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validates all URLs in the array
 */
export const validateUrls = (urls: string[]): string[] => {
  return urls.map(url => validateUrl(url));
};

/**
 * Validates the entire business form
 */
export const validateBusinessForm = (formData: BusinessFormData): BusinessFormErrors => {
  return {
    name: validateBusinessName(formData.name),
    description: validateDescription(formData.description),
    contactEmail: validateEmail(formData.contactEmail),
    contactPhone: validatePhoneNumber(formData.contactPhone),
    urls: validateUrls(formData.urls),
  };
};

/**
 * Checks if the form has any validation errors
 */
export const hasFormErrors = (errors: BusinessFormErrors): boolean => {
  return (
    errors.name !== '' ||
    errors.description !== '' ||
    errors.contactEmail !== '' ||
    errors.contactPhone !== '' ||
    errors.urls.some(error => error !== '')
  );
};

/**
 * Gets initial empty error state
 */
export const getInitialErrors = (): BusinessFormErrors => ({
  name: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
  urls: [''],
});
