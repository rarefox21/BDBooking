import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminEditHotel = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        description: '',
        cheapestPrice: '',
        photos: '',
        featured: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get hotel ID from URL

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch hotel data.');
                
                // Pre-fill the form with existing hotel data
                setFormData({
                    name: data.data.name,
                    city: data.data.city,
                    address: data.data.address,
                    description: data.data.description,
                    cheapestPrice: data.data.cheapestPrice,
                    photos: data.data.photos.join(', '), // Convert array back to comma-separated string
                    featured: data.data.featured || false,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    const { name, city, address, description, cheapestPrice, photos, featured } = formData;

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const hotelData = {
                ...formData,
                photos: photos.split(',').map(url => url.trim()).filter(url => url),
            };

            const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
                method: 'PUT', // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(hotelData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update hotel.');

            setSuccess('Hotel updated successfully! Redirecting...');
            setTimeout(() => navigate('/admin/hotels'), 2000);

        } catch (err) {
            setError(err.message);
        }
    };
    
    if (loading) return <div>Loading hotel data...</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Hotel</h1>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {error && <p className="p-3 bg-red-100 text-red-700 rounded-md">{error}</p>}
                        {success && <p className="p-3 bg-green-100 text-green-700 rounded-md">{success}</p>}
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name</label>
                            <input type="text" name="name" value={name} onChange={onChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" value={city} onChange={onChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" name="address" value={address} onChange={onChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={description} onChange={onChange} required rows="4" className="w-full mt-1 p-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                        <div>
                            <label htmlFor="cheapestPrice" className="block text-sm font-medium text-gray-700">Cheapest Price (BDT)</label>
                            <input type="number" name="cheapestPrice" value={cheapestPrice} onChange={onChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="photos" className="block text-sm font-medium text-gray-700">Photos (comma-separated URLs)</label>
                            <input type="text" name="photos" value={photos} onChange={onChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="featured" checked={featured} onChange={onChange} id="featured" className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Featured Property</label>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Link to="/admin/hotels" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">
                                Cancel
                            </Link>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                Update Hotel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminEditHotel;
