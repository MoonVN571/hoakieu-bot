const { readdirSync } = require('fs');
const client = require('../index');
readdirSync('./events/Bots').forEach(event => require('../events/Bots/' + event));
readdirSync('./commands/').forEach(cmdType => {
    readdirSync(`./commands/${cmdType}`).forEach(category => {
        readdirSync(`./commands/${cmdType}/${category}`).forEach(file => {
            const pull = require(`../commands/${cmdType}/${category}/${file}`);
            if (!pull.name) return;
            if (cmdType == 'Prefixes') client.commands.set(pull.name, pull);
            else client.slashCommands.set(pull.name, pull);
        });
    });
});
require('./callback');