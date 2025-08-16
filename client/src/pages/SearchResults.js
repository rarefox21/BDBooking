import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for filters, initialized from URL params
    const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');

    const destination = searchParams.get('destination');

    const fetchResults = useCallback(async () => {
        if (!destination) {
            navigate('/');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const searchBody = {
                destination,
                min: searchParams.get('min') || undefined,
                max: searchParams.get('max') || undefined,
            };

            const response = await fetch('http://localhost:5000/api/hotels/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchBody),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results.');
            }

            const data = await response.json();
            if (data.success) {
                setResults(data.data);
            } else {
                throw new Error(data.message || 'An error occurred.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [destination, navigate, searchParams]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const handleFilterApply = () => {
        // Update the URL search params, which will trigger the useEffect to re-fetch
        setSearchParams({ destination, min: minPrice, max: maxPrice });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar */}
                    <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md self-start">
                        <h2 className="text-xl font-bold mb-4">Filter Results</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price (BDT)</label>
                                <input
                                    type="number"
                                    id="minPrice"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 1000"
                                />
                            </div>
                            <div>
                                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price (BDT)</label>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 15000"
                                />
                            </div>
                            <button
                                onClick={handleFilterApply}
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Search Results */}
                    <div className="lg:col-span-3">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            Search Results for "{destination}"
                        </h1>

                        {loading && <p className="text-center">Loading...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        
                        {!loading && !error && (
                            results.length > 0 ? (
                                <div className="space-y-6">
                                    {results.map(hotel => (
                                        <div key={hotel._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-6">
                                            <img 
                                                src={hotel.photos?.[0] || 'https://placehold.co/200x200/3498DB/FFFFFF?text=Hotel'} 
                                                alt={`View of ${hotel.name}`} 
                                                className="w-full sm:w-48 h-48 object-cover rounded-lg"
                                            />
                                            <div className="flex-grow text-center sm:text-left">
                                                <h2 className="text-2xl font-bold text-blue-600">{hotel.name}</h2>
                                                <p className="text-gray-600">{hotel.address}</p>
                                                <p className="text-sm text-gray-500 mt-2">{hotel.description}</p>
                                            </div>
                                            <div className="text-center sm:text-right flex-shrink-0">
                                                <p className="text-2xl font-bold text-gray-800 mb-2">BDT {hotel.cheapestPrice.toLocaleString()}</p>
                                                <button 
                                                    onClick={() => navigate(`/hotel/${hotel._id}`)}
                                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
                                                >
                                                    View Deal
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center bg-white p-6 rounded-lg shadow-md">No hotels found matching your criteria.</p>
                            )
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchResults;
