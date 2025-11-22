// Debug utility to decode JWT token
export const decodeToken = (token) => {
  if (!token) {
    console.log('🔍 No token found in localStorage');
    return null;
  }

  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid token format');
      return null;
    }

    // Decode payload (base64url)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    
    console.log('🔐 Token Decoded:');
    console.log('  - Subject (user):', decoded.sub);
    console.log('  - Role:', decoded.role);
    console.log('  - Issued At:', new Date(decoded.iat * 1000).toLocaleString());
    console.log('  - Expires At:', new Date(decoded.exp * 1000).toLocaleString());
    console.log('  - Is Expired?', Date.now() > decoded.exp * 1000);
    console.log('  - Full payload:', decoded);

    return decoded;
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};

// Check token validity
export const checkTokenValidity = () => {
  const token = localStorage.getItem('token');
  const decoded = decodeToken(token);
  
  if (!decoded) {
    return { valid: false, reason: 'Invalid token format' };
  }

  if (Date.now() > decoded.exp * 1000) {
    return { valid: false, reason: 'Token expired' };
  }

  if (!decoded.role) {
    return { valid: false, reason: 'No role in token' };
  }

  return { 
    valid: true, 
    role: decoded.role,
    user: decoded.sub,
    expiresAt: new Date(decoded.exp * 1000).toLocaleString()
  };
};
