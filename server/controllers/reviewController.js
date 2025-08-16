import Hotel from '../models/Hotel.js';

/**
 * @desc    Create a new review for a hotel
 * @route   POST /api/reviews/:hotelId
 * @access  Private
 */
export const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { hotelId } = req.params;
    const { id: userId, username } = req.user; // Get user info from token payload

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        // Check if the user has already reviewed this hotel
        const alreadyReviewed = hotel.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: "You have already reviewed this hotel." });
        }

        const review = {
            user: userId,
            username: username,
            rating: Number(rating),
            comment,
        };

        hotel.reviews.push(review);
        hotel.numReviews = hotel.reviews.length;
        hotel.rating = hotel.reviews.reduce((acc, item) => item.rating + acc, 0) / hotel.reviews.length;

        await hotel.save();

        res.status(201).json({ success: true, message: "Review added successfully!" });

    } catch (err) {
        console.error("Create Review Error:", err);
        res.status(500).json({ success: false, message: "Failed to add review.", error: err.message });
    }
};
