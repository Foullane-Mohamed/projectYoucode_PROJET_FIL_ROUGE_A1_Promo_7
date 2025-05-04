/**
 * FileSystem utility functions
 * 
 * This utility provides functions for handling file operations.
 */

/**
 * Save data to local storage
 * @param {string} key - The key to save data under
 * @param {*} data - The data to save
 */
export const saveData = (key, data) => {
  const serializedData = typeof data === 'object' ? JSON.stringify(data) : data;
  localStorage.setItem(key, serializedData);
  return true;
};

/**
 * Get data from local storage
 * @param {string} key - The key to retrieve data from
 * @returns {*} - The stored data or null if not found
 */
export const getData = (key) => {
  const serializedData = localStorage.getItem(key);
  if (!serializedData) return null;
  
  try {
    // Try to parse as JSON first
    return JSON.parse(serializedData);
  } catch (err) {
    // If not valid JSON, return as is
    return serializedData;
  }
};

/**
 * Remove data from local storage
 * @param {string} key - The key to remove
 */
export const removeData = (key) => {
  localStorage.removeItem(key);
  return true;
};

/**
 * Clear all data from local storage
 */
export const clearAllData = () => {
  localStorage.clear();
  return true;
};

export default {
  saveData,
  getData,
  removeData,
  clearAllData
};
