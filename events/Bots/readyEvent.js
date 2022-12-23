const { ActivityType } = require('discord.js');
const client = require('../../index');
client.on('ready', async () => {
    console.log(client.user.tag + " is online!");
    let slashCommands = [];
    client.slashCommands.forEach(data => {
        if (data.developer) data.defaultMemberPermissions = ['Administrator'];
        if (data.disabled) return;
        slashCommands.push(data);
    });
    await client.application.commands.set(slashCommands);
    // client.guilds.cache.reduce((a, g) => a + g.members.cache.map(m => !m.user.bot).length, 0) 
    const update = () => client.user.setPresence({
        status: 'online',
        activities: [{
            name: 'HOA KIEU',
            type: ActivityType.Listening
        }]
    });
    update();
});
