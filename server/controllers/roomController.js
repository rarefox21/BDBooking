import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

/**
 * @desc    Create a new room and associate it with a hotel
 * @route   POST /api/rooms/:hotelId
 * @access  Private/Admin
 */
export const createRoom = async (req, res) => {
    const hotelId = req.params.hotelId;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            // Add the new room's ID to the hotel's rooms array
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            // If updating the hotel fails, it's good practice to log it.
            // A more advanced implementation might delete the created room here (transactional).
            console.error("Failed to update hotel with new room:", err);
        }
        res.status(201).json({ success: true, message: "Room created successfully!", data: savedRoom });
    } catch (err) {
        console.error("Create Room Error:", err);
        res.status(500).json({ success: false, message: "Failed to create room.", error: err.message });
    }
};

/**
 * @desc    Update a room
 * @route   PUT /api/rooms/:id
 * @access  Private/Admin
 */
export const updateRoom = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        res.status(200).json({ success: true, message: "Room updated!", data: updatedRoom });
    } catch (err) {
        console.error("Update Room Error:", err);
        res.status(500).json({ success: false, message: "Failed to update room.", error: err.message });
    }
};

/**
 * @desc    Delete a room and remove it from its hotel
 * @route   DELETE /api/rooms/:id/:hotelId
 * @access  Private/Admin
 */
export const deleteRoom = async (req, res) => {
    const { id, hotelId } = req.params;
    try {
        const deletedRoom = await Room.findByIdAndDelete(id);

        if (!deletedRoom) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        try {
            // Remove the room's ID from the hotel's rooms array
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: id },
            });
        } catch (err) {
            // Log the error but don't block the success response, as the room is already deleted.
            console.error("Failed to update hotel after deleting room:", err);
        }
        res.status(200).json({ success: true, message: "Room deleted!" });
    } catch (err) {
        console.error("Delete Room Error:", err);
        res.status(500).json({ success: false, message: "Failed to delete room.", error: err.message });
    }
};
