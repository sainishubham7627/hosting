const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });  // Update path if .env is in the root directory

const mongoose = require("mongoose");

// ✅ Debugging: Check if MONGO_URI is loaded
if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is NOT loaded. Check your .env file!");
    process.exit(1); // Exit if MONGO_URI is missing
} else {
    if (process.env.NODE_ENV !== 'production') {
        console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI); // Log only in development
    }
}

const connectToMongo = async (retries = 5, delay = 5000) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  // Optional in Mongoose 6+
            useUnifiedTopology: true, // Optional in Mongoose 6+
        });
        console.log("✅ Successfully connected to MongoDB Atlas");
    } catch (error) {
        if (retries === 0) {
            console.error("❌ MongoDB connection failed after multiple attempts:", error.message);
            process.exit(1); // Stop execution after retries are exhausted
        } else {
            console.log(`⚠️ MongoDB connection failed, retrying in ${delay / 1000} seconds...`);
            setTimeout(() => connectToMongo(retries - 1, delay), delay); // Retry after a delay
        }
    }
};

module.exports = connectToMongo;
