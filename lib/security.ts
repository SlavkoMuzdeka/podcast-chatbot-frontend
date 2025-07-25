/**
 * Security utilities and constants
 * Implements security best practices for the application
 */

// Security constants
export const SECURITY_CONFIG = {
  // JWT token expiration (24 hours)
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000,

  // Session timeout (30 minutes of inactivity)
  SESSION_TIMEOUT: 30 * 60 * 1000,

  // Maximum login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,

  // Lockout duration (15 minutes)
  LOCKOUT_DURATION: 15 * 60 * 1000,

  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
} as const;

// Security headers for API requests
export const SECURITY_HEADERS = {
  "Content-Type": "application/json",
  // "X-Content-Type-Options": "nosniff",
  // "X-Frame-Options": "DENY",
  // "X-XSS-Protection": "1; mode=block",
  // "Referrer-Policy": "strict-origin-when-cross-origin",
} as const;

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .substring(0, 1000); // Limit length
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate password strength
export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(
      `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`
    );
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (
    SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  isRateLimited(
    identifier: string,
    maxAttempts: number = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS
  ): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return false;
    }

    // Reset if lockout period has passed
    if (now - record.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return false;
    }

    // Check if rate limited
    if (record.count >= maxAttempts) {
      return true;
    }

    // Increment attempt count
    record.count++;
    record.lastAttempt = now;

    return false;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Session management
export const isTokenExpired = (tokenTimestamp: number): boolean => {
  return Date.now() - tokenTimestamp > SECURITY_CONFIG.TOKEN_EXPIRY;
};

// Content Security Policy
export const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join("; ");
