const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.User
    ],
});
const mongoose = require('mongoose');
require('dotenv').config();
module.exports = client;
module.exports.discord = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require('./config.json');
client.botEmojis = require('./assets/emojis.json');
client.dev = process.env.NODE_ENV == 'development';
// MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_STRING, {}).then(() => {
    console.log("Connected to MongoDB!");
});
require('./handler/index');
process.on('uncaughtException', (error) => {
    console.log(error);
    let message = error.stack;
    let msgObj = {};
    if (message.length > 2000) {
        msgObj['files'] = [{
            name: new Date().toLocaleString() + ".txt", attachment: Buffer.from(message)
        }];
    } else msgObj['content'] = `\`\`\`${message}\`\`\``;
    if (client.dev) return process.exit();
    client.channels.cache.get(client.config.logs.error)?.send(msgObj);
});
client.on("error", console.error);
client.login(process.env.TOKEN, err => console.log(err));