import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    // Show a loading indicator while the initial auth check is in progress
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    // If the user is authenticated AND is an admin, render the requested component
    if (isAuthenticated && user?.isAdmin) {
        return children;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If authenticated but NOT an admin, redirect to the homepage
    return <Navigate to="/" />;
};

export default AdminRoute;
