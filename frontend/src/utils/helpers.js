/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} - Slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Delay function (for testing/debugging)
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get image URL
 * @param {string} path - Image path
 * @returns {string} - Full image URL
 */
export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg';
  
  // If it's a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's a relative path, construct the full URL
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseURL}/storage/${path}`;
};

/**
 * Calculate discount
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {object} - Object with discounted price and savings
 */
export const calculateDiscount = (price, discountPercent) => {
  const discountAmount = (price * discountPercent) / 100;
  const discountedPrice = price - discountAmount;
  
  return {
    original: price,
    discounted: discountedPrice,
    savings: discountAmount,
    percent: discountPercent
  };
};

/**
 * Group array items by a property
 * @param {Array} array - Array to group
 * @param {string} key - Property to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(
    'en-US', 
    { ...defaultOptions, ...options }
  ).format(new Date(date));
};