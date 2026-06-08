export interface FormData {
  name: string;
  age: number;
  email: string;
  gender: string;
  acceptTerms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: string; // base64
}

export interface FormSubmission extends FormData {
  id: string;
  source: 'uncontrolled' | 'hook-form';
  submittedAt: number;
}

export interface PasswordStrengthResult {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  score: number;
}
