import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingId, setBookingId] = useState(searchParams.get('bookingId'));

    useEffect(() => {
        const confirmPayment = async () => {
            if (!bookingId) {
                setError("No booking ID found. Payment cannot be confirmed.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/payments/success', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookingId }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to confirm payment.');
                }
                // If successful, the backend has updated the booking status to "Paid"
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [bookingId]);

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                    {loading ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900">Confirming Your Payment...</h1>
                            <p className="text-gray-600">Please wait while we confirm your transaction.</p>
                            <div className="flex justify-center items-center pt-4">
                               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                            </div>
                        </>
                    ) : error ? (
                        <>
                            <h1 className="text-2xl font-bold text-red-600">Payment Confirmation Failed</h1>
                            <p className="text-gray-600 mt-2">{error}</p>
                            <Link to="/my-bookings" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                Check My Bookings
                            </Link>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
                            <p className="text-gray-600 mt-2">Your booking has been confirmed. Thank you for choosing BDBooking!</p>
                            <Link to="/my-bookings" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                View My Bookings
                            </Link>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
