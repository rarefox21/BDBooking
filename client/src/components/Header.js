import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-blue-600">BDBooking</Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Stays</Link>
                            <a href="#" className="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Flights</a>
                            <a href="#" className="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Car Rentals</a>
                            <a href="#" className="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Attractions</a>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.isAdmin && (
                                     <Link to="/admin/dashboard" className="text-gray-800 font-medium hover:text-blue-600">Admin Panel</Link>
                                )}
                                <Link to="/my-bookings" className="text-gray-800 font-medium hover:text-blue-600">My Bookings</Link>
                                <span className="text-gray-800 font-medium">Welcome, {user?.username || 'User'}!</span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/register" className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium mr-2">
                                    Register
                                </Link>
                                <Link to="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                            <i className="fas fa-bars fa-lg"></i>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
