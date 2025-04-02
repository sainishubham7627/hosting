const express = require("express");
const router = express.Router();
const EmailModel = require("../models/EmailModel");

// 📌 Schedule an email
router.post("/schedule", async (req, res) => {
    try {
        const { email, subject, message, sendAt } = req.body;

        const newEmail = new EmailModel({
            email,
            subject,
            message,
            sendAt: new Date(sendAt) // Convert string to Date object
        });

        await newEmail.save();
        res.status(201).json({ success: true, message: "Email scheduled successfully!" });
    } catch (error) {
        console.error("Error scheduling email:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
