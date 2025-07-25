import { useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  email: string;
  // Add any other fields returned from your backend
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // assuming your API returns { user: {...} }
        } else {
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/auth'; // redirect to login page
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
};
