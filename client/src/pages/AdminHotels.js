import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the new modal component

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State to manage the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/hotels', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch hotels.');
                const data = await response.json();
                if (data.success) setHotels(data.data);
                else throw new Error(data.message);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    // Function to open the modal and set which hotel to delete
    const handleDeleteClick = (hotel) => {
        setHotelToDelete(hotel);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setHotelToDelete(null);
    };

    // Function to execute the deletion after confirmation
    const handleConfirmDelete = async () => {
        if (!hotelToDelete) return;
        
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/hotels/${hotelToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete the hotel.');

            const data = await response.json();
            if (data.success) {
                setHotels(hotels.filter(h => h._id !== hotelToDelete._id));
                setSuccess('Hotel deleted successfully!');
            } else {
                throw new Error(data.message || 'Deletion failed.');
            }
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Hotels</h1>
                    <Link to="/admin/hotels/new" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        Add New Hotel
                    </Link>
                </div>
                {loading && <p>Loading hotels...</p>}
                {error && <p className="p-3 bg-red-100 text-red-700 rounded-md">{error}</p>}
                {success && <p className="p-3 bg-green-100 text-green-700 rounded-md">{success}</p>}
                {!loading && !error && (
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">City</th>
                                    <th className="py-2 px-4">Price</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.map(hotel => (
                                    <tr key={hotel._id} className="border-b hover:bg-gray-50">
                                        <td className="py-4 px-4">{hotel.name}</td>
                                        <td className="py-4 px-4">{hotel.city}</td>
                                        <td className="py-4 px-4">BDT {hotel.cheapestPrice}</td>
                                        <td className="py-4 px-4 space-x-2 whitespace-nowrap">
                                            <Link to={`/admin/hotels/edit/${hotel._id}`} className="text-green-600 hover:underline">Edit</Link>
                                            <button onClick={() => handleDeleteClick(hotel)} className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            <Footer />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Hotel"
                message={`Are you sure you want to permanently delete "${hotelToDelete?.name}"?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default AdminHotels;
