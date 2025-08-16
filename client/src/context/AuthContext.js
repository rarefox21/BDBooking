import React, { createContext, useReducer, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Corrected: Use default import

// --- INITIAL STATE ---
// Look for a token in local storage on initial load
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true, // Add a loading state
};

// --- AUTH REDUCER ---
// Handles state changes for login and logout actions
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
            };
        case 'LOGOUT':
        case 'AUTH_ERROR':
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
            };
        case 'STOP_LOADING':
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

// --- CREATE CONTEXT ---
export const AuthContext = createContext(initialState);

// --- PROVIDER COMPONENT ---
// Wraps the application and provides the auth state
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing token on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode(token); // Use the new import name
                // Check if the token has expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    dispatch({ type: 'AUTH_ERROR' });
                } else {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: decodedToken,
                    });
                }
            } catch (error) {
                console.error("Invalid token found", error);
                dispatch({ type: 'AUTH_ERROR' });
            }
        } else {
            dispatch({ type: 'STOP_LOADING' });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwt_decode(token); // Use the new import name
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: decodedToken,
        });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
