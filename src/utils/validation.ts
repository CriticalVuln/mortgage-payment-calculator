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

// Validate address input - comprehensive validation for all location formats
export const validateAddress = (address: string): string => {
  const trimmed = address.trim();
  
  // Must have some content
  if (trimmed.length === 0) {
    return '';
  }
  
  // Very short inputs (1-2 chars) are generally invalid
  if (trimmed.length < 2) {
    return '';
  }
  
  // Check if it's a valid ZIP code (5 digits, optionally with dash and 4 more digits)
  if (validateZipCode(trimmed)) {
    return trimmed;
  }
  
  // Check if it's a state abbreviation (2 uppercase letters)
  const statePattern = /^[A-Z]{2}$/;
  if (statePattern.test(trimmed)) {
    return trimmed;
  }
  
  // Check if it's a city name (letters, spaces, commas, periods, apostrophes, hyphens)
  // Allow names like "St. Louis", "O'Fallon", "Winston-Salem"
  const cityPattern = /^[a-zA-Z\s,.''-]+$/;
  if (cityPattern.test(trimmed) && trimmed.length >= 2) {
    return trimmed;
  }
  
  // Check if it's a full address (contains both numbers and letters)
  const hasNumber = /\d/.test(trimmed);
  const hasLetter = /[a-zA-Z]/.test(trimmed);
  
  if (hasNumber && hasLetter && trimmed.length >= 3) {
    return trimmed;
  }
  
  // If it contains only numbers but is longer than 5 digits, might be extended ZIP
  if (/^\d{6,}$/.test(trimmed)) {
    return trimmed;
  }
    // Allow any input that has reasonable characters for addresses
  // This is a fallback for edge cases
  const addressPattern = /^[a-zA-Z0-9\s,.'"#&()\/\-]+$/;
  if (addressPattern.test(trimmed) && trimmed.length >= 2) {
    return trimmed;
  }
  
  // If none of the patterns match, return empty string
  return '';
};

// Boolean version for validation checks
export const isValidAddress = (address: string): boolean => {
  return validateAddress(address) !== '';
};

// Validate API key format (basic check)
export const validateApiKey = (key: string): boolean => {
  const trimmedKey = key.trim();
  
  // API keys should be at least 10 characters and can contain:
  // - Alphanumeric characters (a-z, A-Z, 0-9)
  // - Common special characters used in API keys (+, =, -, _, /, .)
  const apiKeyPattern = /^[a-zA-Z0-9+/=_.-]{10,}$/;
  return apiKeyPattern.test(trimmedKey) && trimmedKey.length >= 10;
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
