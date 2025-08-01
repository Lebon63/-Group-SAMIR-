import { createContext } from 'react';

const AuthContext = createContext({
  auth: {
    isAuthenticated: false,
    user: null,
    role: null,
    loading: true
  },
  setAuth: () => {}
});

export default AuthContext;