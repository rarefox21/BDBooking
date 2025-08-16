import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication token not found. Please log in again.");
                }

                const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings.');
                }

                const result = await response.json();
                if (result.success) {
                    setBookings(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
             <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
                {error && <div className="p-4 bg-red-100 text-red-700 rounded-md mb-6">{error}</div>}
                
                {bookings.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-6">
                                <img 
                                    src={booking.hotel?.photos?.[0] || 'https://placehold.co/200x200/3498DB/FFFFFF?text=Hotel'} 
                                    alt={`View of ${booking.hotel?.name}`} 
                                    className="w-full sm:w-48 h-48 object-cover rounded-lg"
                                />
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-blue-600">{booking.hotel?.name}</h2>
                                    <p className="text-gray-600">{booking.hotel?.city}</p>
                                    <p className="font-semibold mt-2">{booking.room?.title}</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
                                        <div>
                                            <p className="font-bold">Check-in:</p>
                                            <p>{formatDate(booking.checkInDate)}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold">Check-out:</p>
                                            <p>{formatDate(booking.checkOutDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-lg font-bold">Total Price</p>
                                    <p className="text-2xl font-bold text-gray-800 mb-2">BDT {booking.totalPrice.toLocaleString()}</p>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                        <p className="text-gray-700">You have no bookings yet.</p>
                        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                            Find your next stay
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyBookings;
