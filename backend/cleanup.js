require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function cleanUp() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo-pro');
        const email = 'rabibhagat789@gmail.com';
        const result = await User.deleteOne({ email });
        console.log("== CLEANUP START ==");
        if (result.deletedCount > 0) {
            console.log(`Successfully deleted test user: ${email}`);
        } else {
            console.log(`User ${email} not found. Already clean.`);
        }
        console.log("== CLEANUP END ==");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
cleanUp();
