import express from 'express';
import { createRoom, updateRoom, deleteRoom } from '../../controllers/roomController.js';
import { verifyAdmin } from '../../utils/verifyToken.js';

const router = express.Router();

// --- ADMIN PROTECTED ROUTES ---

/**
 * @route   POST /api/rooms/:hotelId
 * @desc    Create a new room for a specific hotel
 * @access  Private/Admin
 */
router.post('/:hotelId', verifyAdmin, createRoom);

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update a room
 * @access  Private/Admin
 */
router.put('/:id', verifyAdmin, updateRoom);

/**
 * @route   DELETE /api/rooms/:id/:hotelId
 * @desc    Delete a room from a specific hotel
 * @access  Private/Admin
 */
router.delete('/:id/:hotelId', verifyAdmin, deleteRoom);


export default router;
