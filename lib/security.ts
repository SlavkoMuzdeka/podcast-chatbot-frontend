export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
} as const;

export const SECURITY_HEADERS = {
  "Content-Type": "application/json",
} as const;

export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  return input.trim().replace(/[<>]/g, "").substring(0, 1000);
};

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
