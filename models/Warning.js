const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    index: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Warning", warningSchema);