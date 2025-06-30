import { auth } from '../firebase';

/**
 * Make authenticated API calls with Firebase token
 */
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const token = await currentUser.getIdToken();
    
    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Don't override Content-Type for FormData
    const headers = options.body instanceof FormData 
      ? { 'Authorization': `Bearer ${token}` }
      : { ...defaultHeaders, ...options.headers };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle common error cases
    if (response.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/admin/login';
      return;
    }

    if (response.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    }

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Helper for making authenticated JSON API calls
 */
export const apiCall = async (url, options = {}) => {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API call failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Helper for making authenticated API calls with FormData
 */
export const apiCallWithFile = async (url, formData, options = {}) => {
  const response = await authenticatedFetch(url, {
    ...options,
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API call failed: ${response.status}`);
  }

  return response.json();
};