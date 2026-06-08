import { PasswordStrengthResult } from '../types';

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  return { hasUppercase, hasLowercase, hasNumber, hasSpecial, score };
}
