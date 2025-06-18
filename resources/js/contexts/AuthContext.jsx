import React, { createContext, useContext, useState, useEffect } from 'react';
// Temporarily commenting out Firebase imports to fix loading issues
// import { 
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     signInWithPopup,
//     GoogleAuthProvider,
//     signOut,
//     onAuthStateChanged
// } from 'firebase/auth';
// import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Set to false initially
    const [isAdmin, setIsAdmin] = useState(false);

    // Temporarily disable Firebase auth logic
    useEffect(() => {
        // TODO: Re-enable Firebase auth once credentials are configured
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Temporary mock login
        console.log('Login attempt:', email);
        throw new Error('Firebase not configured yet');
    };

    const register = async (email, password) => {
        // Temporary mock register
        console.log('Register attempt:', email);
        throw new Error('Firebase not configured yet');
    };

    const loginWithGoogle = async () => {
        // Temporary mock Google login
        console.log('Google login attempt');
        throw new Error('Firebase not configured yet');
    };

    const logout = async () => {
        // Temporary mock logout
        setUser(null);
        setIsAdmin(false);
    };

    const value = {
        user,
        isAdmin,
        login,
        register,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};