// SHA-256 hash for 'admin123'. 
// In a real app, this should be handled server-side, but this prevents the plain-text password from appearing in the bundle.
const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ADMIN_HASH;
  } catch (e) {
    console.error("Crypto API not supported", e);
    return false;
  }
};

export const checkSession = (): boolean => {
  return sessionStorage.getItem('magie_admin_session') === 'true';
};

export const setSession = (isValid: boolean) => {
  if (isValid) {
    sessionStorage.setItem('magie_admin_session', 'true');
  } else {
    sessionStorage.removeItem('magie_admin_session');
  }
};