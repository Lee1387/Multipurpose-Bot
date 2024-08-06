const mongoose = require('mongoose');

const kickSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kick', kickSchema);