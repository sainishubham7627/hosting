require("dotenv").config(); // Ensure .env file is loaded

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");

const connectToMongo = require("./db");
const sendMail = require("./utils/sendEmail"); // Import sendEmail function
const Note = require("./models/Note"); // Import Note model
const User = require("./models/User"); // Import User model

// Ensure .env variables are loaded
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI NOT FOUND in .env file!");
    process.exit(1);
}

// Connect to MongoDB
connectToMongo();

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env

// Debug: Check if MONGO_URI is loaded
console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded!" : "❌ NOT LOADED!");

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../src/', 'uploads')));// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/auth", require("./routes/verifyEmail"));

// Reminder Feature: Runs Every Minute
cron.schedule("* * * * *", async () => {
    console.log("⏳ Running Reminder Job...");
    try {
        await sendReminders();
    } catch (error) {
        console.error("❌ Error in cron job:", error);
    }
});

console.log("✅ Reminder job is running...");

const sendReminders = async () => {
    const now = new Date();
    const reminders = await Note.find({ sendAt: { $lte: now } });

    console.log(`📌 Found ${reminders.length} reminders to send.`);

    for (const reminder of reminders) {
        try {
            await processReminder(reminder);
        } catch (error) {
            console.error(`❌ Error sending reminder for ${reminder.title}:`, error);
        }
    }
};

const processReminder = async (reminder) => {
    try {
        console.log("🔔 Processing reminder:", reminder.title);

        // Fetch user email
        const user = await User.findById(reminder.user);
        if (!user || !user.email) {
            console.error("❌ No email found for user:", reminder.user);
            return;
        }

        // Prepare email details
        const subject = "Scheduled Reminder";
        const message = `Hello ${user.name},\n\nYou have a reminder:\n\n"${reminder.title}"\n\nDescription: ${reminder.description}\n\n- Noteify`;

        // Send email
        await sendMail(user.email, subject, message);
        console.log(`📧 Email sent to ${user.email}`);

        // Delete reminder after sending
        await Note.findByIdAndDelete(reminder._id);
        console.log(`🗑️ Deleted reminder for ${user.email}`);
    } catch (error) {
        console.error("❌ Error processing reminder:", error);
    }
};

// Start Server
app.listen(port, () => {
    console.log(`🚀 Noteify backend listening on http://localhost:${port}`);
});
