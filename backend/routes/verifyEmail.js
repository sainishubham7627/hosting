const express = require("express");
const User = require("../models/User");
const router = express.Router();

const CLIENT_URL = "http://localhost:3000"; // Change to your frontend URL

router.get("/verify-email/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.redirect(`${CLIENT_URL}/verify-email?status=error&message=Invalid or expired token`);
        }

        // ✅ Check if the token has expired
        if (user.tokenExpiration && user.tokenExpiration < new Date()) {
            return res.redirect(`${CLIENT_URL}/verify-email?status=error&message=Verification token expired`);
        }

        // ✅ If already verified
        if (user.isVerified) {
            return res.redirect(`${CLIENT_URL}/login?status=already_verified`);
        }

        // ✅ Mark user as verified
        user.isVerified = true;
        user.verificationToken = null;
        user.tokenExpiration = null;
        await user.save();

        return res.redirect(`${CLIENT_URL}/login?status=success&message=Email verified successfully! You can now log in.`);

    } catch (error) {
        console.error("Verification Error:", error.message);
        return res.redirect(`${CLIENT_URL}/verify-email?status=error&message=Server error, try again later`);
    }
});

module.exports = router;
