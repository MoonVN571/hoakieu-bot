const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    guildId: String,
    embedColor: Number,
    ticket: {
        list: Array,
        msgId: String,
        logs: String,
        role: String
    }
}, { id: false });
module.exports = mongoose.model('servers', schema);