import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        // Use the MONGO_URI from your .env file
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
            process.exit(1);
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
