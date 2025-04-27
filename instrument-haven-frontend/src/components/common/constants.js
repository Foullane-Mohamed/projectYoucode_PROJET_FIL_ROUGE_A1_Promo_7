// Constants for product and category images

// Product image constants - Using local images
export const PRODUCT_IMAGES = [
  "/images/products/electric-guitar.jpg", // Electric guitar
  "/images/products/piano.jpg", // Piano
  "/images/products/drums.jpg", // Drums 
  "/images/products/trumpet.jpg", // Trumpet
  "/images/products/acoustic-guitar.jpg", // Acoustic guitar
  "/images/products/violin.jpg" // Violin
];

// Category image constants - Using local images
export const CATEGORY_IMAGES = {
  "string": "/images/categories/string-instruments.jpg",
  "guitar": "/images/categories/guitar.jpg",
  "percussion": "/images/categories/percussion.jpg",
  "drums": "/images/categories/drums.jpg",
  "wind": "/images/categories/wind-instruments.jpg",
  "brass": "/images/categories/brass.jpg",
  "keyboard": "/images/categories/keyboard.jpg",
  "piano": "/images/categories/piano.jpg",
  "electronic": "/images/categories/electronic.jpg",
  "default": "/images/categories/music-instruments.jpg"
};

// Get an image URL for a product based on product ID
export const getProductImage = (productId) => {
  const index = (productId % PRODUCT_IMAGES.length) || 0;
  return PRODUCT_IMAGES[index];
};

// Get an image URL for a category based on its name
export const getCategoryImage = (category) => {
  if (!category || !category.name) return CATEGORY_IMAGES.default;
  
  const lowerName = category.name.toLowerCase();
  
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (lowerName.includes(key)) {
      return url;
    }
  }
  
  return CATEGORY_IMAGES.default;
};