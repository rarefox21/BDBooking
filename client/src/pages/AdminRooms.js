import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal

const AdminRooms = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State for the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);

    // Form state for adding a new room
    const [newRoomData, setNewRoomData] = useState({
        title: '',
        price: '',
        maxPeople: '',
        description: '',
        roomNumbers: '',
    });

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/hotels', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch hotels.');
            const data = await response.json();
            if (data.success) {
                setHotels(data.data);
                if (data.data.length > 0 && !selectedHotel) {
                    setSelectedHotel(data.data[0]._id);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (!selectedHotel) return;
        const hotel = hotels.find(h => h._id === selectedHotel);
        if (hotel) {
            setRooms(hotel.rooms || []);
        }
    }, [selectedHotel, hotels]);

    const handleFormChange = (e) => {
        setNewRoomData({ ...newRoomData, [e.target.name]: e.target.value });
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const roomData = {
                ...newRoomData,
                roomNumbers: newRoomData.roomNumbers.split(',').map(num => ({ number: parseInt(num.trim(), 10) })),
            };

            const response = await fetch(`http://localhost:5000/api/rooms/${selectedHotel}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(roomData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create room.');

            setSuccess('Room created successfully!');
            fetchHotels(); // Refetch all hotel data to get the updated room list
            setNewRoomData({ title: '', price: '', maxPeople: '', description: '', roomNumbers: '' });

        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteClick = (room) => {
        setRoomToDelete(room);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRoomToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!roomToDelete) return;

        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/rooms/${roomToDelete._id}/${selectedHotel}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete room.');

            setSuccess('Room deleted successfully!');
            const updatedHotels = hotels.map(h => {
                if (h._id === selectedHotel) {
                    return { ...h, rooms: h.rooms.filter(r => r._id !== roomToDelete._id) };
                }
                return h;
            });
            setHotels(updatedHotels);

        } catch (err) {
            setError(err.message);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Rooms</h1>
                
                {loading && <p>Loading...</p>}
                {error && <p className="p-3 my-4 bg-red-100 text-red-700 rounded-md">{error}</p>}
                {success && <p className="p-3 my-4 bg-green-100 text-green-700 rounded-md">{success}</p>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md self-start">
                        <h2 className="text-xl font-bold mb-4">Add New Room</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label htmlFor="hotelSelect" className="block text-sm font-medium text-gray-700">Select Hotel</label>
                                <select id="hotelSelect" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                                    {hotels.map(hotel => <option key={hotel._id} value={hotel._id}>{hotel.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Room Title</label>
                                <input type="text" name="title" value={newRoomData.title} onChange={handleFormChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (BDT)</label>
                                <input type="number" name="price" value={newRoomData.price} onChange={handleFormChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                            </div>
                             <div>
                                <label htmlFor="maxPeople" className="block text-sm font-medium text-gray-700">Max People</label>
                                <input type="number" name="maxPeople" value={newRoomData.maxPeople} onChange={handleFormChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={newRoomData.description} onChange={handleFormChange} required rows="3" className="w-full mt-1 p-2 border border-gray-300 rounded-md"></textarea>
                            </div>
                            <div>
                                <label htmlFor="roomNumbers" className="block text-sm font-medium text-gray-700">Room Numbers (comma-separated)</label>
                                <input type="text" name="roomNumbers" value={newRoomData.roomNumbers} onChange={handleFormChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 101, 102, 203"/>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                Add Room
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                         <h2 className="text-xl font-bold mb-4">Existing Rooms for {hotels.find(h => h._id === selectedHotel)?.name}</h2>
                         <div className="space-y-4">
                            {rooms.length > 0 ? rooms.map(room => (
                                <div key={room._id} className="border p-4 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{room.title}</p>
                                        <p className="text-sm text-gray-600">Price: BDT {room.price}</p>
                                    </div>
                                    <button onClick={() => handleDeleteClick(room)} className="text-red-600 hover:underline">Delete</button>
                                </div>
                            )) : <p>No rooms found for this hotel. Add one using the form.</p>}
                         </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Room"
                message={`Are you sure you want to permanently delete the room "${roomToDelete?.title}"?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default AdminRooms;
