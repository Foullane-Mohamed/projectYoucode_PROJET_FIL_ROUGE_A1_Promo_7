export const PRODUCT_IMAGES = [
  "/images/products/electric-guitar.jpg",
  "/images/products/piano.jpg",
  "/images/products/drums.jpg",
  "/images/products/trumpet.jpg",
  "/images/products/acoustic-guitar.jpg",
  "/images/products/violin.jpg"
];

export const CATEGORY_IMAGES = {
  "string": "/images/categories/string-instruments.jpg",
  "guitar": "/images/categories/guitar.jpg",
  "guitare": "/images/categories/guitar.jpg",
  "percussion": "/images/categories/percussion.jpg",
  "drums": "/images/categories/drums.jpg",
  "wind": "/images/categories/wind-instruments.jpg",
  "brass": "/images/categories/brass.jpg",
  "keyboard": "/images/categories/keyboard.jpg",
  "piano": "/images/categories/piano.jpg",
  "violon": "/images/categories/violon.jpg",
  "violin": "/images/categories/violon.jpg",
  "accordion": "/images/categories/accordion.jpg",
  "banjo": "/images/categories/banjo.jpg",
  "electronic": "/images/categories/electronic.jpg",
  "default": "/images/categories/music-instruments.jpg"
};

export const getProductImage = (productId) => {
  const index = (productId % PRODUCT_IMAGES.length) || 0;
  return PRODUCT_IMAGES[index];
};

export const getCategoryImage = (category) => {
  if (!category || !category.name) return CATEGORY_IMAGES.default;
  
  const lowerName = category.name.toLowerCase();
  
  if (CATEGORY_IMAGES[lowerName]) {
    return CATEGORY_IMAGES[lowerName];
  }
  
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (lowerName.includes(key)) {
      return url;
    }
  }
  
  return CATEGORY_IMAGES.default;
};