const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: {
        type: String,  
        default: null  
    },
    tokenExpiration: {  
        type: Date,  
        default: null  
    },
    isVerified: {
        type: Boolean,  
        default: false
    }
}, { timestamps: true });  // ✅ Auto-adds createdAt & updatedAt

// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
