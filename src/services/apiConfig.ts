/**
 * API configuration management
 * Used for storing and managing API keys for external services
 */

// Local storage key for API keys
const API_KEYS_STORAGE_KEY = 'mortgage_app_api_keys';

// API Keys interface
interface ApiKeys {
  ninjas?: string;
  // Add other API keys here as needed
}

// Default empty API keys object
const defaultApiKeys: ApiKeys = {};

// Get API keys from local storage
export const getApiKeys = (): ApiKeys => {
  try {
    const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    return storedKeys ? JSON.parse(storedKeys) : defaultApiKeys;
  } catch (error) {
    return defaultApiKeys;
  }
};

// Save API keys to local storage
export const saveApiKeys = (keys: ApiKeys): void => {
  try {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    // Silently fail if localStorage is not available
  }
};

// Get a specific API key
export const getApiKey = (keyName: keyof ApiKeys): string | undefined => {
  const keys = getApiKeys();
  return keys[keyName];
};

// Save a specific API key
export const saveApiKey = (keyName: keyof ApiKeys, value: string): void => {
  const keys = getApiKeys();
  keys[keyName] = value;
  saveApiKeys(keys);
};

// Check if API key is set
export const hasApiKey = (keyName: keyof ApiKeys): boolean => {
  const key = getApiKey(keyName);
  return Boolean(key && key.trim() !== '');
};

// Clear a specific API key
export const clearApiKey = (keyName: keyof ApiKeys): void => {
  const keys = getApiKeys();
  delete keys[keyName];
  saveApiKeys(keys);
};

// Clear all API keys
export const clearAllApiKeys = (): void => {
  localStorage.removeItem(API_KEYS_STORAGE_KEY);
};
