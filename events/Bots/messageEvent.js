const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../../index');
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    dms(message);
    if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;
    const args = message.content.trim().slice(client.config.prefix.length).split(" ");
    const cmdName = args.shift().toLowerCase();
    const cmd = client.commands.get(cmdName)
        || client.commands.find(cmd => cmd.aliases?.indexOf(cmdName) > -1);
    if (!cmd) return;
    message.send = async (msgData, opt) => {
        if (typeof msgData == 'string') msgData = { content: msgData };
        msgData.allowedMentions = { repliedUser: false };
        let msg;
        if (!opt?.reply) msg = await message.channel.send(msgData);
        else msg = await message.reply(msgData);
        if (opt?.error)
            setTimeout(() => msg.delete().catch(err => { }), 30 * 1000);
    };
    message.isDev = message.author.id == client.config.ownerId;
    if (cmd.developer && !message.isDev) return;
    cmd.execute(client, message, args);
});
async function dms(message) {
    if (message.channel.name?.length >= 18) {
        await client.users.fetch(message.channel.name).then(user => {
            user.send(`${message.content}\n\n${message.attachments.map(d => d.url).join('\n')}`);
        });
    }
    if (message.channel.type !== ChannelType.DM) return;
    // check user channel
    let guild = client.guilds.cache.get('1010419325645099028');
    let channel = guild.channels.cache.find(channel => channel.name == message.author.id);
    if (channel) channel.send(`**${message.author.username}** ${message.content}\n\n${message.attachments.map(d => d.url).join('\n')}`);
    if (message.content.toLowerCase() !== 'gia') return;
    const data = require('../../products');
    client.channels.cache.get('1055810611960873060').send(`${message.author.tag} (${message.author.id}) check`);
    data.forEach(value => {
        message.channel.send({
            embeds: [embed(value)],
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(value.name + '.order')
                    .setLabel('Order product')
                    .setStyle(ButtonStyle.Secondary)
            )]
        }).then(msg => setTimeout(() => msg.delete().catch(err => { }), 2 * 60 * 1000));
    });
}
function embed(data) {
    return {
        author: { name: data.name, iconURL: data.url },
        description: data.description,
        color: data.color,
        timestamp: data.time
    }
}