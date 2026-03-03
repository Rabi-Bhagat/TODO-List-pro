require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo-pro', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const user = await User.findOne({ email: 'rabibhagat789@gmail.com' });
        console.log("== DEBUG START ==");
        if (!user) {
            console.log("User not found!");
        } else {
            console.log("User found:", user.email);
            console.log("Password hash starts with:", user.password.substring(0, 10));
            console.log("Password length:", user.password.length);
            
            // Check if it looks like a bcrypt hash: begins with $2a$ or $2b$
            const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
            console.log("Is properly bcrypt hashed?", isBcrypt);
        }
        console.log("== DEBUG END ==");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkUser();
