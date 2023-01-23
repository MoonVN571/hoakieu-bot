const { ApplicationCommandOptionType, ChannelType, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const serverModel = require("../../../databases/server-model");
module.exports = {
    name: 'setup',
    description: 'setup bot',
    ephemeral: true,
    defaultMemberPermissions: ['Administrator'],
    options: [{
        name: 'ticket',
        description: 'ticket options',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'channel',
            description: 'send ticket, support button',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true
        }, {
            name: 'role',
            description: 'manage role',
            required: true,
            type: ApplicationCommandOptionType.Role
        }, {
            name: 'message',
            description: 'message on embed',
            required: true,
            type: ApplicationCommandOptionType.String
        }, {
            name: 'content',
            description: 'content on create ticket',
            type: ApplicationCommandOptionType.String
        }, {
            name: 'log-channel',
            description: 'ticket logs',
            required: false,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        }, {
            name: 'category',
            description: 'category to create ticket',
            required: false,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildCategory]
        }, {
            name: 'image',
            description: 'image on embed',
            required: false,
            type: ApplicationCommandOptionType.String
        }]
    }],
    async execute(client, interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel,
            logChannel = interaction.options.getChannel('log-channel'),
            category = interaction.options.getChannel('category'),
            msg = interaction.options.getString('message'),
            content = interaction.options.getString('content'),
            role = interaction.options.getRole('role'),
            image = interaction.options.getString('image');
        let db = await serverModel.findOne({ guildId: interaction.guildId });
        if (!db) db = await serverModel.create({ guildId: interaction.guildId });
        switch (interaction.options.getSubcommand()) {
            case 'ticket': {
                interaction.followUp('Sent!');
                channel.send({
                    embeds: [{
                        author: { name: 'Ticket System' },
                        description: msg,
                        color: client.config.embed,
                        image: { url: image }
                    }]
                }).then(async msg => {
                    db.ticket['msgId'] = msg.id;
                    db.ticket['content'] = content;
                    db.ticket['role'] = role.id;
                    db.ticket['logs'] = logChannel?.id;
                    db.ticket['category'] = category?.id;
                    await db.save();
                    msg.edit({
                        components: [new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`${msg.id}.ticket`)
                                .setLabel('Create ticket')
                                .setStyle(ButtonStyle.Secondary)
                        )]
                    }).catch(err => {
                        interaction.followUp({
                            content: err.message
                        });
                    });
                })
            }
                break;
        }
    }
}