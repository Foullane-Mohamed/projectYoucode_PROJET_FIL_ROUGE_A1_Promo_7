// Constants for product and category images

// Product image constants
export const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop&q=80", // Electric guitar
  "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=400&h=300&fit=crop&q=80", // Piano
  "https://images.unsplash.com/photo-1577099600763-efe26a539850?w=400&h=300&fit=crop&q=80", // Drums 
  "https://images.unsplash.com/photo-1573871669414-010dbf73ca84?w=400&h=300&fit=crop&q=80", // Trumpet
  "https://images.unsplash.com/photo-1465225314224-587cd83d322b?w=400&h=300&fit=crop&q=80",  // Acoustic guitar
  "https://images.unsplash.com/photo-1528893583363-e8a0c1ddde7c?w=400&h=300&fit=crop&q=80"   // Violin
];

// Category image constants
export const CATEGORY_IMAGES = {
  "string": "https://images.unsplash.com/photo-1558098329-a11cff621064?w=400&h=300&fit=crop&q=80",
  "guitar": "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=400&h=300&fit=crop&q=80",
  "percussion": "https://images.unsplash.com/photo-1543443258-92b04ad5ec4b?w=400&h=300&fit=crop&q=80",
  "drums": "https://images.unsplash.com/photo-1457523054379-8d03ab9fc2aa?w=400&h=300&fit=crop&q=80",
  "wind": "https://images.unsplash.com/photo-1573871669414-010dbf73ca84?w=400&h=300&fit=crop&q=80",
  "brass": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop&q=80",
  "keyboard": "https://images.unsplash.com/photo-1545293527-e26058c5b48b?w=400&h=300&fit=crop&q=80",
  "piano": "https://images.unsplash.com/photo-1479118013749-9f79d55a32c7?w=400&h=300&fit=crop&q=80",
  "electronic": "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&h=300&fit=crop&q=80",
  "default": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop&q=80"
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