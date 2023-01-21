const { Colors } = require('discord.js');
const client = require('../../index');
client.on('guildMemberAdd', async member => {
    if (client.dev || member.user.bot) return;
    client.channels.cache.get(client.config.logs.welcome)
        .send({
            content: '**Hi ' + member.user.toString() + '**',
            embeds: [{
                author: { name: member.user.tag, iconURL: member.displayAvatarURL() },
                description: '**Welcome to ' + member.guild.name + '!**'
                    + '\n\nXem bảng giá tại <#1055785937789001819>.'
                    + '\nVào <#1055785251303075870> để pick role.',
                color: Colors.DarkGrey,
                timestamp: new Date().toISOString()
            }]
        });
});