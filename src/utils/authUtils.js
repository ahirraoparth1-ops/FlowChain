export function isUnauthorizedError(error) {
  return /^401: .*Unauthorized/.test(error.message);
}

export function handleGoogleLogin() {
  // Redirect to the login API endpoint for Google authentication
  window.location.href = '/api/login';
}

export function handleLogout() {
  // Clear local storage and redirect to logout endpoint
  localStorage.removeItem('user');
  window.location.href = '/api/logout';
}