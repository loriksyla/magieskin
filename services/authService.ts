const SESSION_KEY = 'magie_admin_session';
const PASSWORD_KEY = 'magie_admin_password';

export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    });
    return response.ok;
  } catch (e) {
    console.error("Auth request failed", e);
    return false;
  }
};

export const checkSession = (): boolean => {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
};

export const setSession = (isValid: boolean) => {
  if (isValid) {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(PASSWORD_KEY);
  }
};

export const setAdminPassword = (password: string) => {
  sessionStorage.setItem(PASSWORD_KEY, password);
};

export const getAdminPassword = (): string | null => {
  return sessionStorage.getItem(PASSWORD_KEY);
};
