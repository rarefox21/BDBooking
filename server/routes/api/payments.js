import express from 'express';
import { createPaymentSession, handlePaymentSuccess } from '../../controllers/paymentController.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

/**
 * @route   POST /api/payments/create-session
 * @desc    Create a payment session with a payment gateway
 * @access  Private
 */
router.post('/create-session', verifyToken, createPaymentSession);

/**
 * @route   POST /api/payments/success
 * @desc    Confirm a successful payment and update the booking
 * @access  Public (validation is done by checking booking data)
 */
router.post('/success', handlePaymentSuccess);


export default router;
