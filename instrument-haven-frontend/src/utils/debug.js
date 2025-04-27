/**
 * Debug utilities for troubleshooting API and data issues
 */

/**
 * Inspects a product object and logs validation issues
 * @param {Object} product - The product object to inspect
 * @returns {boolean} - Whether the product is valid
 */
export const validateProduct = (product) => {
  if (!product) {
    console.error('Product is null or undefined');
    return false;
  }
  
  console.group('Product Validation');
  
  let valid = true;
  
  // Check essential properties
  if (!product.id && !product.product_id) {
    console.warn('Missing product ID');
    valid = false;
  }
  
  if (!product.name) {
    console.warn('Missing product name');
    valid = false;
  }
  
  if (product.price === undefined || product.price === null) {
    console.warn('Missing product price');
    valid = false;
  }
  
  // Check image-related properties
  if (product.thumbnail) {
    console.log('Product has thumbnail:', product.thumbnail);
  } else {
    console.warn('Product missing thumbnail');
  }
  
  // Log all product properties for reference
  console.log('All product properties:', Object.keys(product));
  console.log('Product data:', product);
  
  console.groupEnd();
  
  return valid;
};

/**
 * Inspects a wishlist item and logs validation issues
 * @param {Object} item - The wishlist item to inspect
 * @returns {boolean} - Whether the wishlist item is valid
 */
export const validateWishlistItem = (item) => {
  if (!item) {
    console.error('Wishlist item is null or undefined');
    return false;
  }
  
  console.group('Wishlist Item Validation');
  
  let valid = true;
  
  // Check if item has product_id directly
  if (item.product_id) {
    console.log('Wishlist item has product_id:', item.product_id);
  } 
  // Otherwise check if it has a product object
  else if (item.product) {
    console.log('Wishlist item has product object');
    valid = validateProduct(item.product);
  } 
  // If neither, it's not valid
  else {
    console.warn('Wishlist item missing both product_id and product object');
    valid = false;
  }
  
  // Log all item properties for reference
  console.log('All wishlist item properties:', Object.keys(item));
  console.log('Wishlist item data:', item);
  
  console.groupEnd();
  
  return valid;
};

/**
 * Inspects an entire wishlist array and logs validation issues
 * @param {Array} wishlist - The wishlist array to inspect
 * @returns {Array} - Array of valid wishlist items
 */
export const validateWishlist = (wishlist) => {
  if (!Array.isArray(wishlist)) {
    console.error('Wishlist is not an array:', wishlist);
    return [];
  }
  
  console.group('Wishlist Validation');
  console.log(`Validating ${wishlist.length} wishlist items`);
  
  const validItems = wishlist.filter(item => validateWishlistItem(item));
  
  console.log(`Found ${validItems.length} valid items out of ${wishlist.length}`);
  console.groupEnd();
  
  return validItems;
};
