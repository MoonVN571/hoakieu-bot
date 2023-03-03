const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageType } = require('discord.js');
const client = require('../../index');
client.on('messageCreate', async message => {
    if (message.author.id == client.user.id && message.type == MessageType.ChannelPinnedMessage) return message.delete().catch(err => { });
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
    // check ten channel la id va gui cho user message
    if (message.channel.name?.length >= 18) {
        await client.users.fetch(message.channel.name).then(user => {
            user.send(`${message.content}\n\n${message.attachments.map(d => d.url).join('\n')}`);
        });
    }
    if (message.channel.type !== ChannelType.DM) return;
    // check user channel
    let guild = client.guilds.cache.get(client.config.guildId);
    let channel = guild.channels.cache.find(channel => channel.name == message.author.id);
    if (channel) channel.send(`**${message.author.username}** ${message.content}\n\n${message.attachments.map(d => d.url).join('\n')}`);
    // gia & devgia
    if (message.content.toLowerCase() !== 'gia' && !client.dev
        || (message.content.toLowerCase() !== 'devgia' && client.dev)) return;
    const data = require('../../products');
    client.channels.cache.get(client.config.logs.check).send(`${message.author.tag} (${message.author.id}) check`);
    data.forEach(value => {
        message.channel.send({
            embeds: [{
                author: { name: value.name, iconURL: value.url },
                description: value.description,
                color: value.color,
                timestamp: value.time
            }],
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(value.name + '.order')
                    .setLabel('Order product')
                    .setStyle(ButtonStyle.Secondary)
            )]
        }).then(msg => setTimeout(() => msg.delete().catch(err => { }), 2 * 60 * 1000));
    });
}