import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const HotelPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Get dates from navigation state or set defaults
    const [dates, setDates] = useState(location.state?.dates || [
        { startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 1)), key: 'selection' }
    ]);

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingStatus, setBookingStatus] = useState({ message: '', type: '' });

    // State for review form
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    const { user } = useContext(AuthContext);

    const dayDifference = (date1, date2) => {
        const timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays === 0 ? 1 : diffDays;
    };
    const days = dayDifference(dates[0].endDate, dates[0].startDate);

    const fetchHotel = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
            if (!response.ok) throw new Error('Hotel not found');
            const result = await response.json();
            if (result.success) {
                setHotel(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotel();
    }, [id]);

    useEffect(() => {
        if (selectedRoom) {
            setTotalPrice(selectedRoom.price * days);
        } else {
            setTotalPrice(0);
        }
    }, [selectedRoom, days]);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
    };

    const handleReserve = async () => {
        setBookingStatus({ message: '', type: '' });
        if (!user) {
            navigate('/login');
            return;
        }
        if (!selectedRoom) {
            setBookingStatus({ message: "Please select a room first.", type: 'error' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("You must be logged in to make a reservation.");

            // Step 1: Create the booking
            const roomNumberId = selectedRoom.roomNumbers[0]?._id;
            if (!roomNumberId) throw new Error("No available room numbers for this room type.");

            const bookingRes = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    hotel: hotel._id,
                    room: selectedRoom._id,
                    checkInDate: dates[0].startDate,
                    checkOutDate: dates[0].endDate,
                    totalPrice,
                    roomNumberId,
                }),
            });

            const bookingData = await bookingRes.json();
            if (!bookingRes.ok) throw new Error(bookingData.message || 'Booking failed.');

            setBookingStatus({ message: "Booking created! Redirecting to payment...", type: 'success' });

            // Step 2: Create the payment session
            const paymentRes = await fetch('http://localhost:5000/api/payments/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    bookingId: bookingData.data._id,
                    amount: totalPrice,
                    customerName: user.username,
                    customerEmail: user.email,
                }),
            });

            const paymentData = await paymentRes.json();
            if (!paymentRes.ok) throw new Error(paymentData.message || 'Could not initiate payment.');

            // Step 3: Redirect to the payment gateway
            window.location.href = paymentData.paymentUrl;

        } catch (err) {
            setBookingStatus({ message: err.message, type: 'error' });
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');

        if (rating === 0 || !comment) {
            setReviewError('Please provide a rating and a comment.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("You must be logged in to submit a review.");

            const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ rating, comment }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit review.');

            setReviewSuccess('Thank you for your review!');
            setRating(0);
            setComment('');
            fetchHotel(); // Re-fetch hotel data to show the new review
        } catch (err) {
            setReviewError(err.message);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!hotel) return <div className="text-center py-10">Hotel not found.</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hotel Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">{hotel.name}</h1>
                        <p className="text-gray-600 mt-1"><i className="fas fa-map-marker-alt mr-2"></i>{hotel.address}, {hotel.city}</p>
                        <div className="flex items-center mt-2">
                            <span className="text-yellow-500">{'★'.repeat(Math.round(hotel.rating))}{'☆'.repeat(5 - Math.round(hotel.rating))}</span>
                            <span className="ml-2 text-gray-600">({hotel.numReviews} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Image Gallery & Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 gap-2 mb-8">
                           {(hotel.photos?.length > 0 ? hotel.photos : ['https://placehold.co/600x400?text=Hotel+Image']).slice(0, 4).map((photo, index) => (
                                <div key={index} className="overflow-hidden rounded-lg h-56"><img src={photo} alt={`View ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" /></div>
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">About this hotel</h2>
                        <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md self-start">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Perfect for a {days}-night stay!</h3>
                        <div className="text-2xl font-bold mb-4"><b>BDT {totalPrice.toLocaleString()}</b></div>
                        {bookingStatus.message && (
                            <div className={`p-3 my-2 rounded-md ${bookingStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {bookingStatus.message}
                            </div>
                        )}
                        <button onClick={handleReserve} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Reserve and Pay</button>
                    </div>
                </div>

                {/* Room Selection */}
                <div className="mt-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Select your room</h2>
                    <div className="space-y-6">
                        {hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms.map(room => (
                            <div key={room._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{room.title}</h3>
                                    <p className="text-gray-600 max-w-lg">{room.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">Max people: <b>{room.maxPeople}</b></p>
                                    <p className="text-lg font-bold text-blue-600 mt-2">BDT {room.price.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label htmlFor={`room-${room._id}`} className="font-medium text-gray-700">Select</label>
                                    <input
                                        type="radio"
                                        id={`room-${room._id}`}
                                        name="roomSelection"
                                        value={room._id}
                                        onChange={() => handleSelectRoom(room)}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                </div>
                            </div>
                        )) : <p>No rooms available for this hotel.</p>}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Guest Reviews</h2>
                    {user && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                            {reviewError && <p className="p-3 my-2 bg-red-100 text-red-700 rounded-md">{reviewError}</p>}
                            {reviewSuccess && <p className="p-3 my-2 bg-green-100 text-green-700 rounded-md">{reviewSuccess}</p>}
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                                    <div className="flex space-x-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label>
                                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" required className="w-full mt-1 p-2 border border-gray-300 rounded-md"></textarea>
                                </div>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Submit Review</button>
                            </form>
                        </div>
                    )}
                    <div className="space-y-6">
                        {hotel.reviews && hotel.reviews.length > 0 ? hotel.reviews.map(review => (
                            <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-2">
                                    <span className="font-bold mr-4">{review.username}</span>
                                    <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        )) : <p className="bg-white p-6 rounded-lg shadow-md">No reviews yet. Be the first to leave one!</p>}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HotelPage;
