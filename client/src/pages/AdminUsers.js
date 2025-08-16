import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user: adminUser } = useContext(AuthContext);

    // State for the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch users.');
                const data = await response.json();
                if (data.success) {
                    setUsers(data.data);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Deletion failed.');
            
            setUsers(users.filter(user => user._id !== userToDelete._id));
            setSuccess('User deleted successfully!');

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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
                
                {loading && <p>Loading users...</p>}
                {error && <p className="p-3 my-4 bg-red-100 text-red-700 rounded-md">{error}</p>}
                {success && <p className="p-3 my-4 bg-green-100 text-green-700 rounded-md">{success}</p>}

                {!loading && !error && (
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 px-4">Username</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Is Admin</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="py-4 px-4">{user.username}</td>
                                        <td className="py-4 px-4">{user.email}</td>
                                        <td className="py-4 px-4">{user.isAdmin ? 'Yes' : 'No'}</td>
                                        <td className="py-4 px-4">
                                            <button 
                                                onClick={() => handleDeleteClick(user)} 
                                                className="text-red-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                                                disabled={user._id === adminUser?.id} // Prevent admin from deleting themselves
                                            >
                                                Delete
                                            </button>
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
                title="Delete User"
                message={`Are you sure you want to permanently delete the user "${userToDelete?.username}"?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default AdminUsers;
