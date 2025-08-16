import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Custom error handler utility
const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "You are not authenticated!" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token is not valid!" });
        }
        req.user = userPayload; // Attach the token payload to the request object
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        // A user can access their own info, or an admin can access any user's info
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ success: false, message: "You are not authorized!" });
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // Only a user with isAdmin:true in their token can proceed
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ success: false, message: "You are not authorized! Admin access required." });
        }
    });
};
