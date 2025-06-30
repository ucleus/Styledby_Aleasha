import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase not configured, skipping authentication');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get the user's ID token to check custom claims
          const idTokenResult = await user.getIdTokenResult();
          const hasAdminClaim = idTokenResult.claims.admin === true;
          
          // Development mode bypass
          const isDevelopment = import.meta.env.DEV && import.meta.env.VITE_BYPASS_ADMIN_CHECK === 'true';
          const isAdminUser = hasAdminClaim || isDevelopment;
          
          setIsAdmin(isAdminUser);
          
          console.log('User authenticated:', { 
            email: user.email, 
            hasAdminClaim, 
            isDevelopment, 
            isAdmin: isAdminUser 
          });
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase not configured. Please set up Firebase environment variables.');
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const idTokenResult = await result.user.getIdTokenResult();
      const hasAdminClaim = idTokenResult.claims.admin === true;
      
      // Development mode bypass
      const isDevelopment = import.meta.env.DEV && import.meta.env.VITE_BYPASS_ADMIN_CHECK === 'true';
      
      if (!hasAdminClaim && !isDevelopment) {
        await signOut(auth);
        const errorMsg = `Access denied. User "${result.user.email}" does not have admin privileges.\n\nTo fix this:\n1. Set admin custom claims in Firebase Console\n2. Or add VITE_BYPASS_ADMIN_CHECK=true to .env for development`;
        throw new Error(errorMsg);
      }
      
      if (isDevelopment && !hasAdminClaim) {
        console.warn('⚠️ Development mode: Admin check bypassed. Set proper admin claims for production.');
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase not configured. Please set up Firebase environment variables.');
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
    resetPassword,
    isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};