import express from 'express';
import { createBooking, getMyBookings } from '../../controllers/bookingController.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

// --- USER PROTECTED ROUTES ---

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', verifyToken, createBooking);

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get all bookings for the logged-in user
 * @access  Private
 */
// server/routes/api/bookings.js
router.get('/my-bookings', verifyToken, getMyBookings);


export default router;
