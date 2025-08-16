import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <p>&copy; 2025 BDBooking. All Rights Reserved.</p>
                <div className="mt-4">
                    <a href="#" className="text-gray-400 hover:text-white mx-2">About Us</a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2">Contact</a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
