/**
 * Input validation utilities for mortgage calculator
 * Provides sanitization and validation for user inputs
 */

// Sanitize string inputs to prevent XSS
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/['"]/g, '') // Remove quotes
    .trim()
    .substring(0, 1000); // Limit length
};

// Validate and sanitize numeric inputs
export const validateNumericInput = (
  value: string | number, 
  min: number = 0, 
  max: number = Number.MAX_SAFE_INTEGER
): number => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return min;
  if (numValue < min) return min;
  if (numValue > max) return max;
  
  return numValue;
};

// Validate credit score
export const validateCreditScore = (score: number): number => {
  return validateNumericInput(score, 300, 850);
};

// Validate interest rate
export const validateInterestRate = (rate: number): number => {
  return validateNumericInput(rate, 0, 20); // 0% to 20%
};

// Validate loan amount
export const validateLoanAmount = (amount: number): number => {
  return validateNumericInput(amount, 0, 10000000); // Up to $10M
};

// Validate loan term
export const validateLoanTerm = (term: number): number => {
  const validTerms = [10, 15, 20, 25, 30];
  return validTerms.includes(term) ? term : 30;
};

// Validate ZIP code format
export const validateZipCode = (zip: string): boolean => {
  const zipPattern = /^\d{5}(-\d{4})?$/;
  return zipPattern.test(zip.trim());
};

// Validate address input
export const validateAddress = (address: string): string => {
  const sanitized = sanitizeString(address);
  
  // Basic address validation - must contain at least one number and one letter
  const hasNumber = /\d/.test(sanitized);
  const hasLetter = /[a-zA-Z]/.test(sanitized);
  
  if (!hasNumber || !hasLetter || sanitized.length < 5) {
    return '';
  }
  
  return sanitized;
};

// Validate API key format (basic check)
export const validateApiKey = (key: string): boolean => {
  const sanitized = sanitizeString(key);
  
  // API keys should be alphanumeric and at least 10 characters
  const apiKeyPattern = /^[a-zA-Z0-9_-]{10,}$/;
  return apiKeyPattern.test(sanitized);
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }
}

// Global rate limiter for API calls
export const apiRateLimiter = new RateLimiter(50, 60000); // 50 calls per minute
