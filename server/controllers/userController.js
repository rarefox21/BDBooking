import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// --- HELPER FUNCTION ---
// Generate JWT
const generateToken = (user) => {
    // Include more user info in the token payload for frontend use
    const payload = {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
    };
    // The secret should be in an environment variable, not hardcoded
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


// --- CONTROLLER FUNCTIONS ---

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                token: generateToken(user),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                success: true,
                message: "Login successful",
                token: generateToken(user),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get all users (for admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ success: false, message: "Failed to fetch users." });
    }
};

/**
 * @desc    Delete a user (for admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User removed successfully' });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};
