import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/Booking.js';

/**
 * @desc    Create a payment session with a payment gateway
 * @route   POST /api/payments/create-session
 * @access  Private
 */
export const createPaymentSession = async (req, res) => {
    const { bookingId, amount, customerName, customerEmail } = req.body;

    try {
        // In a real application, you would uncomment this to validate the booking and amount.
        
        const booking = await Booking.findById(bookingId);
        if (!booking || booking.totalPrice !== amount) {
            return res.status(400).json({ success: false, message: "Invalid booking data." });
        }
        

        // 1. Generate a unique transaction ID
        const transactionId = `BDB-${uuidv4().split('-').join('').substring(0, 12).toUpperCase()}`;

        // 2. Prepare the data to send to the payment gateway
        const paymentData = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: transactionId,
            // These URLs should point to your frontend application
            success_url: `http://localhost:3000/payment/success?bookingId=${bookingId}`,
            fail_url: `http://localhost:3000/payment/fail?bookingId=${bookingId}`,
            cancel_url: `http://localhost:3000/payment/cancel`,
            ipn_url: `http://localhost:5000/api/payments/ipn`, // IPN still points to backend
            shipping_method: 'No',
            product_name: 'Hotel Booking',
            product_category: 'Travel',
            product_profile: 'general',
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: 'N/A',
            cus_city: 'N/A',
            cus_country: 'Bangladesh',
            cus_phone: 'N/A',
        };

        // 3. In a real application, you would make an API call to SSLCommerz here.
        // For this simulation, we'll just generate a fake GatewayPageURL.
        console.log("Simulating payment session creation with data:", paymentData);
        const simulatedGatewayURL = `https://sandbox.sslcommerz.com/gw-process/v4/payment/${transactionId}`;

        res.status(200).json({
            success: true,
            paymentUrl: simulatedGatewayURL,
        });

    } catch (err) {
        console.error("Create Payment Session Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create payment session.",
            error: err.message,
        });
    }
};

export const handlePaymentSuccess = async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
        return res.status(400).json({ success: false, message: "Booking ID is required." });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: { paymentStatus: 'Paid' } },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully!",
            data: updatedBooking,
        });

    } catch (err) {
        console.error("Payment Success Handler Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update payment status.",
            error: err.message,
        });
    }
};