import Hotel from '../models/Hotel.js';

/**
 * @desc    Create a hotel
 * @route   POST /api/hotels
 * @access  Private/Admin
 */
export const createHotel = async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json({
            success: true,
            message: "Hotel created successfully!",
            data: savedHotel
        });
    } catch (error) {
        console.error("Create Hotel Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Update a hotel
 * @route   PUT /api/hotels/:id
 * @access  Private/Admin
 */
export const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // This option returns the updated document
        );

        if (hotel) {
            res.status(200).json({
                success: true,
                message: "Hotel updated successfully",
                data: hotel
            });
        } else {
            res.status(404).json({ success: false, message: 'Hotel not found' });
        }
    } catch (error) {
        console.error("Update Hotel Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Delete a hotel
 * @route   DELETE /api/hotels/:id
 * @access  Private/Admin
 */
export const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);

        if (hotel) {
            res.status(200).json({ success: true, message: 'Hotel removed' });
        } else {
            res.status(404).json({ success: false, message: 'Hotel not found' });
        }
    } catch (error) {
        console.error("Delete Hotel Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get a single hotel by ID
 * @route   GET /api/hotels/:id
 * @access  Public
 */
export const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('rooms');
        if (hotel) {
            res.status(200).json({ success: true, data: hotel });
        } else {
            res.status(404).json({ success: false, message: 'Hotel not found' });
        }
    } catch (error) {
        console.error("Get Hotel Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get all hotels (for admin)
 * @route   GET /api/hotels
 * @access  Private/Admin
 */
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({}).populate('rooms');
        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels,
        });
    } catch (error) {
        console.error("Get All Hotels Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Search for hotels based on criteria
 * @route   POST /api/hotels/search
 * @access  Public
 */
export const searchHotels = async (req, res) => {
    const { destination, min, max } = req.body;

    try {
        const query = {
            city: { $regex: destination, $options: 'i' }
        };

        if (min || max) {
            query.cheapestPrice = {};
            if (min) query.cheapestPrice.$gte = parseInt(min, 10);
            if (max) query.cheapestPrice.$lte = parseInt(max, 10);
        }

        const hotels = await Hotel.find(query).limit(20);
        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        });
    } catch (error) {
        console.error("Search Hotels Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get all featured hotels for the homepage
 * @route   GET /api/hotels/featured
 * @access  Public
 */
export const getFeaturedHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ featured: true }).limit(4);
        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels,
        });
    } catch (err) {
        console.error("Error fetching featured hotels:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch featured hotels.",
        });
    }
};
