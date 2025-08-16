import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // This will store room numbers and their availability
    // e.g., [{ number: 101, unavailableDates: [...] }, { number: 102, ... }]
    roomNumbers: [{
        number: Number,
        unavailableDates: { type: [Date] }
    }],
}, { timestamps: true });

export default mongoose.model("Room", RoomSchema);
