/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    apiService.setToken(token);
                    const userData = await apiService.getUserAccount();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to initialize auth:', error);
                    localStorage.removeItem('token');
                    apiService.clearToken();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        const refreshTokenInterval = setInterval(async () => {
            if (isAuthenticated) {
                try {
                    const response = await apiService.refreshToken();
                    localStorage.setItem('token', response.token);
                    apiService.setToken(response.token);
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                    localStorage.removeItem('token');
                    apiService.clearToken();
                }
            }
        }, 13 * 24 * 60 * 60 * 1000);

        return () => clearInterval(refreshTokenInterval);
    }, [isAuthenticated]);

    const login = async (credentials) => {
        const response = await apiService.login(credentials);
        localStorage.setItem('token', response.token);
        apiService.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token');
            apiService.clearToken();
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const register = async (userData) => {
        const response = await apiService.register(userData);
        localStorage.setItem('token', response.token);
        apiService.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
    };

    const updateUser = async (updatedUserData) => {
        const updatedUser = await apiService.updateUserAccount(updatedUserData);
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                register,
                updateUser,
                setIsAuthenticated,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
