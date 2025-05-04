export const buildStorageUrl = (imageUrl, storageBaseUrl) => {
  if (!imageUrl) return null;
  
  if (imageUrl.startsWith('http')) return imageUrl;
  
  const baseUrl = storageBaseUrl.endsWith('/') 
    ? storageBaseUrl.slice(0, -1) 
    : storageBaseUrl;
  
  const imagePath = imageUrl.startsWith('/') 
    ? imageUrl 
    : '/' + imageUrl;
  
  return `${baseUrl}${imagePath}`;
};

export const getFileExtension = (path) => {
  if (!path) return '';
  return path.split('.').pop().toLowerCase();
};

export const isImagePath = (path) => {
  if (!path) return false;
  const extension = getFileExtension(path);
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return validExtensions.includes(extension);
};

export const addCacheBuster = (url) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};