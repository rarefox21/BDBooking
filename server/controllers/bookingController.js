import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// Helper function to get all dates between a start and end date
const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];
    while (date <= end) {
        dates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res) => {
    // The user's ID now comes securely from the verifyUser middleware
    const userId = req.user.id;
    const { hotel, room, checkInDate, checkOutDate, totalPrice, roomNumberId } = req.body;

    const newBooking = new Booking({
        hotel,
        user: userId, // Use the ID from the token
        room,
        checkInDate,
        checkOutDate,
        totalPrice,
    });

    try {
        const savedBooking = await newBooking.save();

        // Update the room's availability
        await Room.updateOne(
            { "roomNumbers._id": roomNumberId },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": {
                        $each: getDatesInRange(checkInDate, checkOutDate)
                    }
                },
            }
        );

        res.status(201).json({
            success: true,
            message: "Your booking has been confirmed!",
            data: savedBooking,
        });

    } catch (err) {
        console.error("Create Booking Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create booking. Please try again.",
            error: err.message,
        });
    }
};

/**
 * @desc    Get all bookings for the logged-in user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
    try {
        // Find all bookings that belong to the user ID from the token
        const bookings = await Booking.find({ user: req.user.id })
            .populate('hotel', 'name city photos') // Get hotel name, city, and photos
            .populate('room', 'title price');     // Get room title and price

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve your bookings.",
            error: err.message,
        });
    }
};
