const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

app.use('/', (req, res) => {
    res.send('Hello server');
});

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
    console.log(`Server started in ${process.env.NODE_SERVER} mode in port ${PORT}`);
})