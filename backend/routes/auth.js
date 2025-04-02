    require('dotenv').config();  // Ensure to load .env file

    const express = require('express');
    const User = require('../models/User');
    const router = express.Router();
    const { body, validationResult } = require('express-validator');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const crypto = require('crypto');
    const sendEmail = require('../utils/sendEmail');

    const JWT_SECRET = process.env.JWT_SECRET;  // Load JWT_SECRET from .env
    const CLIENT_URL = process.env.CLIENT_URL;  // Load CLIENT_URL from .env

    // 📌 Signup Route with Email Verification
    router.post('/createuser', [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    ], async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: "User already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            
            // ✅ Generate a unique verification token & expiration time
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

            // ✅ Create user with default `isVerified: false`
            user = new User({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
                verificationToken: verificationToken,
                isVerified: false,
                tokenExpiration: tokenExpiration
            });

            await user.save();

            // 📩 Send verification email
            const verifyLink = `${CLIENT_URL}/api/auth/verify-email/${verificationToken}`; // Generate the verification link

            const message = `   
                <h1>Email Verification</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${verifyLink}" target="_blank">${verifyLink}</a>
                <p><b>Note:</b> This link will expire in 1 hour.</p>
            `;

            await sendEmail(user.email, "Email Verification", message);
            success = true;

            res.json({ success, message: "Verification email sent. Please check your inbox." });

        } catch (error) {
            console.error("Signup Error:", error.message);
            res.status(500).json({ success: false, message: "Some error occurred" });
        }
    });

    // 📌 Email Verification Route
    router.get('/verify-email/:token', async (req, res) => {
        try {
            let user = await User.findOne({ verificationToken: req.params.token });

            if (!user) {
                return res.redirect(`${CLIENT_URL}/verify-email?status=error&message=Invalid or expired token`);
            }

            // ✅ Check if the token has expired
            if (user.tokenExpiration && user.tokenExpiration < new Date()) {
                // 🔥 Generate a new token & send a new email
                const newToken = crypto.randomBytes(32).toString('hex');
                user.verificationToken = newToken;
                user.tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
                await user.save();

                const verifyLink = `${CLIENT_URL}/verify-email/${newToken}`;
                const message = `<h1>Email Verification</h1>
                    <p>Your previous token expired. Click the link below to verify:</p>
                    <a href="${verifyLink}" target="_blank">${verifyLink}</a>`;

                await sendEmail(user.email, "New Email Verification", message);

                return res.redirect(`${CLIENT_URL}/verify-email?status=expired&message=Verification token expired. New email sent.`);
            }

            // ✅ If already verified, redirect to login
            if (user.isVerified) {
                return res.redirect(`${CLIENT_URL}/login?status=already_verified`);
            }

            // ✅ Mark user as verified
            user.isVerified = true;
            user.verificationToken = null;
            user.tokenExpiration = null;
            await user.save();

            // ✅ Redirect to frontend login page after success
            return res.redirect(`${CLIENT_URL}/login?status=success&message=Email verified successfully! You can now log in.`);

        } catch (error) {
            console.error("Verification Error:", error.message);
            return res.redirect(`${CLIENT_URL}/verify-email?status=error&message=Server error. Try again later.`);
        }
    });

    // 📌 Login Route (Only allow verified users)
    router.post('/login', [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ], async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Invalid email or password" });
            }

            // ✅ Prevent login if email is not verified
            if (!user.isVerified) {
                return res.status(400).json({ error: "Please verify your email before logging in" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Invalid credentials" });
            }

            const data = { user: { id: user.id } };
            const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' }); // Set token expiration
            success = true;
            res.json({ success, authtoken });

        } catch (error) {
            console.error("Login Error:", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    });

    module.exports = router;
