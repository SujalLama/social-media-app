const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err, db) => {
            console.log(`Db connected at host: ${mongoose.connection.host}`)
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;