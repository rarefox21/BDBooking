import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import hotels from './data/hotels.js';
import rooms from './data/rooms.js';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Booking.deleteMany();
        await Room.deleteMany();
        await Hotel.deleteMany();
        await User.deleteMany();

        // Insert users
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        // Insert rooms
        const createdRooms = await Room.insertMany(rooms);

        // Prepare hotels with rooms
        const hotelsWithRooms = hotels.map((hotel, index) => {
            return {
                ...hotel,
                // Assign first 3 rooms to first hotel, next 3 to second, etc.
                rooms: createdRooms.slice(index * 3, (index + 1) * 3).map(r => r._id)
            };
        });

        await Hotel.insertMany(hotelsWithRooms);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Booking.deleteMany();
        await Room.deleteMany();
        await Hotel.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
