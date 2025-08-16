import express from 'express';
import { createReview } from '../../controllers/reviewController.js';
import { verifyUser } from '../../utils/verifyToken.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

// --- USER PROTECTED ROUTE ---

/**
 * @route   POST /api/reviews/:hotelId
 * @desc    Create a new review for a hotel
 * @access  Private
 */
router.post('/:hotelId', verifyToken, createReview);


export default router;
