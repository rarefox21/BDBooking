import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import hotelRoutes from './routes/api/hotels.js';
import userRoutes from './routes/api/users.js';
import bookingRoutes from './routes/api/bookings.js';
import roomRoutes from './routes/api/rooms.js';
import reviewRoutes from './routes/api/reviews.js';
import paymentRoutes from './routes/api/payments.js';

// Load environment variables
dotenv.config();

// --- INITIALIZE EXPRESS APP ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- CONNECT TO DATABASE ---
connectDB();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('BDBooking API is running!');
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
