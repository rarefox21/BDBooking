import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PaymentFail = () => {
    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                    <div>
                        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
                        <p className="text-gray-600 mt-2">
                            Unfortunately, we were unable to process your payment. Please try again or contact your bank for assistance.
                        </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <Link 
                            to="/my-bookings" 
                            className="inline-block bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300"
                        >
                            Check My Bookings
                        </Link>
                        <Link 
                            to="/" 
                            className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentFail;
