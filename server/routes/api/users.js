import express from 'express';
import {
    registerUser,
    loginUser,
    getAllUsers,
    deleteUser
} from '../../controllers/userController.js';
import { verifyAdmin } from '../../utils/verifyToken.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
// Handles user registration
router.post('/register', registerUser);

// Handles user login
router.post('/login', loginUser);


// --- ADMIN PROTECTED ROUTES ---
// Gets a list of all users
router.get('/', verifyAdmin, getAllUsers);

// Deletes a specific user by their ID
router.delete('/:id', verifyAdmin, deleteUser);


export default router;
