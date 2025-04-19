/**
 * Debug helper functions for the Instrument Haven application
 */

// Enable or disable verbose debug logging
const DEBUG_MODE = true;

/**
 * Enhanced console logging that only runs in debug mode
 * @param {string} message - The message to log
 * @param {any} data - The data to log
 */
export const debugLog = (message, data) => {
  if (DEBUG_MODE && console && console.log) {
    if (data !== undefined) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

/**
 * Safely extract data from API responses with proper error handling
 * @param {Object} response - The API response object
 * @param {Array<string>} path - The path to extract data from
 * @param {any} defaultValue - The default value to return if data not found
 * @returns {any} The extracted data or default value
 */
export const safelyExtractData = (response, path = [], defaultValue = []) => {
  try {
    if (!response) return defaultValue;
    
    let current = response;
    for (const key of path) {
      if (current === undefined || current === null) return defaultValue;
      current = current[key];
    }
    
    return current === undefined ? defaultValue : current;
  } catch (error) {
    debugLog(`Error extracting data from path [${path.join('.')}]:`, error);
    return defaultValue;
  }
};

/**
 * Safely parse JSON from string with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {any} defaultValue - The default value to return if parsing fails
 * @returns {any} The parsed object or default value
 */
export const safelyParseJSON = (jsonString, defaultValue = {}) => {
  try {
    if (!jsonString) return defaultValue;
    return JSON.parse(jsonString);
  } catch (error) {
    debugLog('Error parsing JSON:', error);
    return defaultValue;
  }
};

export default {
  debugLog,
  safelyExtractData,
  safelyParseJSON
};