import express from 'express';
import {
    createHotel,
    searchHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    getAllHotels,
    getFeaturedHotels
} from '../../controllers/hotelController.js';
import { verifyAdmin } from '../../utils/verifyToken.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
// Handles searching for hotels based on criteria
router.post('/search', searchHotels);

// Gets a list of featured hotels for the homepage
router.get('/featured', getFeaturedHotels);

// Gets a single hotel by its ID
router.get('/:id', getHotelById);


// --- ADMIN PROTECTED ROUTES ---
// Gets a list of all hotels for the admin panel
router.get('/', verifyAdmin, getAllHotels);

// Creates a new hotel
router.post('/', verifyAdmin, createHotel);

// Updates a specific hotel by its ID
router.put('/:id', verifyAdmin, updateHotel);

// Deletes a specific hotel by its ID
router.delete('/:id', verifyAdmin, deleteHotel);


export default router;
