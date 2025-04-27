/**
 * Sample wishlist data for testing and fallback display
 */

export const sampleWishlistItems = [
  {
    id: 1,
    product_id: 1,
    user_id: 1,
    created_at: "2023-05-15T10:20:30Z",
    updated_at: "2023-05-15T10:20:30Z",
    product: {
      id: 1,
      name: "Fender Stratocaster",
      description: "Iconic electric guitar with three single-coil pickups",
      price: 1499.99,
      thumbnail: "products/fender-stratocaster.jpg",
      images: ["products/fender-stratocaster-1.jpg", "products/fender-stratocaster-2.jpg"],
      stock: 10,
      category_id: 1,
      brand: "Fender",
      rating: 4.8,
      review_count: 120,
      on_sale: false,
      sale_price: null
    }
  },
  {
    id: 2,
    product_id: 5,
    user_id: 1,
    created_at: "2023-05-16T15:30:45Z",
    updated_at: "2023-05-16T15:30:45Z",
    product: {
      id: 5,
      name: "Gibson Les Paul",
      description: "Solid body electric guitar with dual humbucker pickups",
      price: 2499.99,
      thumbnail: "products/gibson-les-paul.jpg",
      images: ["products/gibson-les-paul-1.jpg", "products/gibson-les-paul-2.jpg"],
      stock: 5,
      category_id: 1,
      brand: "Gibson",
      rating: 4.9,
      review_count: 95,
      on_sale: true,
      sale_price: 2199.99
    }
  },
  {
    id: 3,
    product_id: 12,
    user_id: 1,
    created_at: "2023-05-17T09:15:20Z",
    updated_at: "2023-05-17T09:15:20Z",
    product: {
      id: 12,
      name: "Yamaha P-125 Digital Piano",
      description: "88-key weighted digital piano with realistic sound",
      price: 649.99,
      thumbnail: "products/yamaha-p125.jpg",
      images: ["products/yamaha-p125-1.jpg", "products/yamaha-p125-2.jpg"],
      stock: 8,
      category_id: 3,
      brand: "Yamaha",
      rating: 4.7,
      review_count: 78,
      on_sale: false,
      sale_price: null
    }
  },
  {
    id: 4,
    product_id: 18,
    user_id: 1,
    created_at: "2023-05-18T14:40:10Z",
    updated_at: "2023-05-18T14:40:10Z",
    product: {
      id: 18,
      name: "Shure SM58 Microphone",
      description: "Industry-standard dynamic vocal microphone",
      price: 99.99,
      thumbnail: "products/shure-sm58.jpg",
      images: ["products/shure-sm58-1.jpg", "products/shure-sm58-2.jpg"],
      stock: 20,
      category_id: 5,
      brand: "Shure",
      rating: 4.9,
      review_count: 210,
      on_sale: false,
      sale_price: null
    }
  },
  {
    id: 5,
    product_id: 24,
    user_id: 1,
    created_at: "2023-05-19T11:25:55Z",
    updated_at: "2023-05-19T11:25:55Z",
    product: {
      id: 24,
      name: "Zildjian A Custom Cymbal Pack",
      description: "Professional cymbal pack with 14\" hi-hats, 16\" & 18\" crashes, and 20\" ride",
      price: 899.99,
      thumbnail: "products/zildjian-cymbal-pack.jpg",
      images: ["products/zildjian-cymbal-pack-1.jpg", "products/zildjian-cymbal-pack-2.jpg"],
      stock: 3,
      category_id: 4,
      brand: "Zildjian",
      rating: 4.8,
      review_count: 45,
      on_sale: true,
      sale_price: 799.99
    }
  }
];

/**
 * Get sample images for placeholder product display
 * @returns {Array} Array of image URLs
 */
export const getSampleImages = () => [
  'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Guitar
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Piano
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Drums
  'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Microphone
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Violin
];

/**
 * Generate a fallback image URL for a product
 * @param {number|string} productId - The product ID (optional)
 * @returns {string} - An image URL
 */
export const getFallbackImage = (productId) => {
  const images = getSampleImages();
  
  if (!productId) {
    // Return a random image if no ID is provided
    return images[Math.floor(Math.random() * images.length)];
  }
  
  // Use the product ID to consistently pick the same image for a specific product
  const index = (typeof productId === 'string' ? productId.charCodeAt(0) : productId) % images.length;
  return images[index];
};
