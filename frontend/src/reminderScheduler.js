const cron = require('node-cron');
const sendEmail = require('./utils/sendEmail');
const sendWhatsApp = require('./utils/sendWhatsApp');
const Note = require('./models/Note');
const User = require('./models/User');

// Function to check and send reminders
const checkReminders = async () => {
    const now = new Date();
    const notes = await Note.find({ reminderDateTime: { $lte: now } });

    for (const note of notes) {
        const user = await User.findById(note.user);
        if (!user) continue;

        // Send email reminder
        await sendEmail(user.email, 'Reminder', `Your reminder for '${note.title}': ${note.description}`);
        
        // Send WhatsApp reminder (if enabled)
        await sendWhatsApp(user.phone, `Reminder: ${note.title}\n${note.description}`);

        // Remove the reminder after sending
        note.reminderDateTime = null;
        await note.save();
    }
};

// Schedule the function to run every minute
cron.schedule('* * * * *', () => {
    console.log('Checking for reminders...');
    checkReminders();
});

module.exports = checkReminders;
