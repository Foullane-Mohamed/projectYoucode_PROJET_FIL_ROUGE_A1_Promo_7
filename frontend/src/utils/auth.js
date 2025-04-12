// Authentication utility functions

// Save auth data to localStorage
export const setAuthData = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Remove auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user has a specific role
export const hasRole = (roleName) => {
  const user = getUser();
  if (!user || !user.role) return false;
  return user.role.name === roleName;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole('Admin');
};