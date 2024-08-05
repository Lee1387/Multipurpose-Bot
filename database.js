const mongoose = require("mongoose");
const { mongoUri } = require("./config.json");

mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

module.exports = mongoose.connection;