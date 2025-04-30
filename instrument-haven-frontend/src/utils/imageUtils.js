/**
 * Image Utility Functions
 * Handles image URL construction and validation
 */

/**
 * Constructs a proper URL for images stored in Laravel's public storage
 * 
 * @param {string} imageUrl - The relative path to the image
 * @param {string} storageBaseUrl - The base URL for storage (e.g. http://localhost:8000/storage)
 * @returns {string} The complete URL to the image
 */
export const buildStorageUrl = (imageUrl, storageBaseUrl) => {
  if (!imageUrl) return null;
  
  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Format the base URL (remove trailing slash if exists)
  const baseUrl = storageBaseUrl.endsWith('/') 
    ? storageBaseUrl.slice(0, -1) 
    : storageBaseUrl;
  
  // Format the image path (add leading slash if missing)
  const imagePath = imageUrl.startsWith('/') 
    ? imageUrl 
    : '/' + imageUrl;
  
  return `${baseUrl}${imagePath}`;
};

/**
 * Gets the file extension from a path
 * 
 * @param {string} path - The file path
 * @returns {string} The file extension
 */
export const getFileExtension = (path) => {
  if (!path) return '';
  return path.split('.').pop().toLowerCase();
};

/**
 * Checks if a string is a valid image path
 * 
 * @param {string} path - The file path to check
 * @returns {boolean} True if it's a valid image path
 */
export const isImagePath = (path) => {
  if (!path) return false;
  const extension = getFileExtension(path);
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return validExtensions.includes(extension);
};

/**
 * Creates a cache-busting URL by adding a timestamp
 * 
 * @param {string} url - The URL to modify
 * @returns {string} URL with cache busting parameter
 */
export const addCacheBuster = (url) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};
