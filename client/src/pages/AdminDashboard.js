import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboard = () => {
    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card for managing hotels */}
                    <Link to="/admin/hotels" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow block">
                        <div className="flex items-center">
                            <i className="fas fa-hotel text-3xl text-blue-500 mr-4"></i>
                            <div>
                                <h2 className="text-xl font-bold text-blue-600">Manage Hotels</h2>
                                <p className="text-gray-600 mt-2">Add, edit, or delete hotel listings.</p>
                            </div>
                        </div>
                    </Link>

                    {/* Card for managing rooms */}
                    <Link to="/admin/rooms" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow block">
                        <div className="flex items-center">
                            <i className="fas fa-door-open text-3xl text-green-500 mr-4"></i>
                            <div>
                                <h2 className="text-xl font-bold text-green-600">Manage Rooms</h2>
                                <p className="text-gray-600 mt-2">Add, edit, or delete room types for hotels.</p>
                            </div>
                        </div>
                    </Link>

                    {/* Card for managing users */}
                    <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow block">
                        <div className="flex items-center">
                            <i className="fas fa-users text-3xl text-red-500 mr-4"></i>
                            <div>
                                <h2 className="text-xl font-bold text-red-600">Manage Users</h2>
                                <p className="text-gray-600 mt-2">View and manage user accounts.</p>
                            </div>
                        </div>
                    </Link>

                     {/* Card for viewing bookings (Placeholder) */}
                    <div className="bg-white p-6 rounded-lg shadow-md opacity-50 cursor-not-allowed">
                         <div className="flex items-center">
                            <i className="fas fa-book-reader text-3xl text-purple-500 mr-4"></i>
                            <div>
                                <h2 className="text-xl font-bold text-purple-600">View Bookings</h2>
                                <p className="text-gray-600 mt-2">View all user reservations (coming soon).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
