import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBox from '../components/SearchBox';

const HomePage = () => {
    // State for the AI Itinerary Modal
    const [isAiModalOpen, setAiModalOpen] = useState(false);
    const [aiItinerary, setAiItinerary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiErrorMessage, setAiErrorMessage] = useState('');

    // State for featured hotels
    const [featuredHotels, setFeaturedHotels] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);

    // Fetch featured hotels when the component mounts
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/hotels/featured');
                const data = await response.json();
                if (data.success) {
                    setFeaturedHotels(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch featured hotels:", error);
            } finally {
                setFeaturedLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // This function is passed down to the SearchBox component
    const handlePlanWithAi = async (searchData) => {
        if (!searchData.destination) {
            setAiErrorMessage("Please enter a destination first.");
            setAiModalOpen(true);
            return;
        }

        setAiItinerary('');
        setAiErrorMessage('');
        setIsAiLoading(true);
        setAiModalOpen(true);

        const prompt = `Create a travel itinerary for a trip to ${searchData.destination}, Bangladesh, from ${searchData.checkinDate} to ${searchData.checkoutDate} for ${searchData.adults} adults and ${searchData.children} children. Provide a day-by-day plan with suggested activities and places to visit. Make it sound exciting and appealing to a tourist. Format the response in Markdown.`;
        
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = ""; // API key is handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

            const result = await response.json();
            
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const text = result.candidates[0].content.parts[0].text;
                setAiItinerary(text);
            } else {
                throw new Error("Invalid response structure from API.");
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setAiErrorMessage(`Failed to generate itinerary. Please try again. Error: ${error.message}`);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="bg-gray-100">
            <Header />

            <main className="hero-section text-white" style={{background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1080&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdGVsfGVufDB8MHwwfHx8MA%3D%3D') no-repeat center center`, backgroundSize: 'cover'}}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find your next stay</h1>
                    <p className="text-lg md:text-xl mb-8">Search deals on hotels, homes, and much more...</p>
                    <SearchBox onPlanWithAi={handlePlanWithAi} />
                </div>
            </main>
            
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Properties</h2>
                 {featuredLoading ? (
                     <p className="text-center">Loading featured properties...</p>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredHotels.map(hotel => (
                            <Link to={`/hotel/${hotel._id}`} key={hotel._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 block">
                                <img src={hotel.photos?.[0] || 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D'} alt={hotel.name} className="w-full h-48 object-cover"/>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                                    <p className="text-gray-600 mt-2">{hotel.city}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-yellow-500">{'★'.repeat(Math.round(hotel.rating))}{'☆'.repeat(5 - Math.round(hotel.rating))}</span>
                                        <span className="ml-2 text-sm text-gray-500">({hotel.numReviews} reviews)</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                 )}
            </section>

            <Footer />

            {/* AI Itinerary Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Your AI-Powered Itinerary</h2>
                            <button onClick={() => setAiModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {isAiLoading && (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                                    <p className="mt-4 text-gray-600">Generating your personalized trip plan...</p>
                                </div>
                            )}
                            {aiErrorMessage && <p className="text-red-500">{aiErrorMessage}</p>}
                            {aiItinerary && (
                                <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: aiItinerary.replace(/\n/g, '<br />') }}></div>
                            )}
                        </div>
                        <div className="p-4 border-t text-right">
                             <button onClick={() => setAiModalOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
