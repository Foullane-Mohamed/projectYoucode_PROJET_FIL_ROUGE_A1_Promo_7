/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strength < 3) {
    return {
      isValid: false,
      message: 'Password must contain at least 3 of the following: uppercase, lowercase, numbers, special characters',
    };
  }

  return {
    isValid: true,
    message: 'Password is strong',
  };
};

/**
 * Phone number validation
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Required field validation
 * @param {string} value - Value to check
 * @returns {boolean} - True if not empty
 */
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Min length validation
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum length
 * @returns {boolean} - True if valid
 */
export const minLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Form validation
 * @param {object} values - Form values
 * @param {object} rules - Validation rules for each field
 * @returns {object} - Validation errors
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];

    // Required validation
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = 'This field is required';
      return;
    }

    // Email validation
    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = 'Please enter a valid email address';
      return;
    }

    // Min length validation
    if (fieldRules.minLength && value && !minLength(value, fieldRules.minLength)) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      return;
    }

    // Phone validation
    if (fieldRules.phone && value && !isValidPhone(value)) {
      errors[field] = 'Please enter a valid phone number';
      return;
    }

    // Password validation
    if (fieldRules.password && value) {
      const passwordResult = validatePassword(value);
      if (!passwordResult.isValid) {
        errors[field] = passwordResult.message;
        return;
      }
    }

    // Password match validation
    if (fieldRules.match && values[fieldRules.match] !== value) {
      errors[field] = `Must match ${fieldRules.match}`;
      return;
    }

    // Custom validation
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customResult = fieldRules.custom(value, values);
      if (customResult) {
        errors[field] = customResult;
        return;
      }
    }
  });

  return errors;
};