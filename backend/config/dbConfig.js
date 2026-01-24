const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.MONGODB_URI);
const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {});
    }
    catch(err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Exit the process with failure
    }
}
module.exports = connectDB;
