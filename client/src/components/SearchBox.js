import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = ({ onPlanWithAi }) => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [isGuestPopoverOpen, setGuestPopoverOpen] = useState(false);

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        setCheckinDate(today.toISOString().split('T')[0]);
        setCheckoutDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    const handleSearchClick = () => {
        if (!destination) {
            // In a real app, you might show a more elegant error message
            alert("Please enter a destination.");
            return;
        }
        
        const queryParams = new URLSearchParams({
            destination,
            checkin: checkinDate,
            checkout: checkoutDate,
            adults,
            children,
        }).toString();

        navigate(`/search?${queryParams}`);
    };

    const handleAiClick = () => {
        onPlanWithAi({ destination, checkinDate, checkoutDate, adults, children });
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Destination Input */}
                <div className="md:col-span-2">
                    <label htmlFor="destination" className="block text-left text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <div className="relative">
                        <i className="fas fa-map-marker-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Cox's Bazar, Dhaka" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="checkin" className="block text-left text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <input type="date" id="checkin" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                    <div>
                        <label htmlFor="checkout" className="block text-left text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <input type="date" id="checkout" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                </div>

                {/* Guest Input */}
                <div className="relative">
                    <label htmlFor="guests" className="block text-left text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <div className="relative">
                        <i className="fas fa-user-friends absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="guests" value={`${adults} adults · ${children} children`} readOnly onClick={() => setGuestPopoverOpen(!isGuestPopoverOpen)} className="cursor-pointer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                    {isGuestPopoverOpen && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl p-4 text-gray-800 z-10 text-left">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-medium">Adults</span>
                                <div className="flex items-center">
                                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="h-8 w-8 bg-gray-200 rounded-full text-lg font-bold">-</button>
                                    <span className="w-12 text-center font-bold mx-2">{adults}</span>
                                    <button onClick={() => setAdults(adults + 1)} className="h-8 w-8 bg-gray-200 rounded-full text-lg font-bold">+</button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Children</span>
                                <div className="flex items-center">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="h-8 w-8 bg-gray-200 rounded-full text-lg font-bold">-</button>
                                    <span className="w-12 text-center font-bold mx-2">{children}</span>
                                    <button onClick={() => setChildren(children + 1)} className="h-8 w-8 bg-gray-200 rounded-full text-lg font-bold">+</button>
                                </div>
                            </div>
                            <button onClick={() => setGuestPopoverOpen(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm">Done</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button onClick={handleSearchClick} className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md text-lg">
                    Search
                </button>
                <button onClick={handleAiClick} className="w-full sm:w-1/3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md text-lg flex items-center justify-center gap-2">
                    <i className="fas fa-magic"></i>
                    Plan my trip with AI
                </button>
            </div>
        </div>
    );
};

export default SearchBox;
