const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    },
    file:{
        type: String,
        default: null
    },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                return this.sendAt ? !!value : true;
            },
            message: "Email is required when setting a reminder."
        }
    },
    sendAt: {
        type: Date,
        index: true
    }
});

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);
