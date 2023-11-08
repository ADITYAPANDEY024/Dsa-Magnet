
const mongoose = require('mongoose')
require('dotenv').config()
const dbconnection = async () => {
    await mongoose.connect(process.env.TEST_DB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to db successfully!"))
        .catch((err) => {
            console.log(err);
            throw new Error("Failed to connect to database!");
        });
}

module.exports = dbconnection;


