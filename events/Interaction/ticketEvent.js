const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const server = require('../../databases/server-model');
module.exports = async (client, interaction) => {
    if (!interaction.customId) return;
    let db = await server.findOne({ guildId: interaction.guildId });
    if (!db) db = await server.create({ guildId: interaction.guildId });
    const logChannel = db.ticket?.logs;
    const supporter = db.ticket?.role;
    const category = db.ticket?.category;
    const content = db.ticket?.content;
    const mentionTicket = `Hi, ${interaction.user.toString()} <@&${supporter}>${content || ''}`;
    const color = db.embedColor || client.config.embed;
    // create ticket
    if (interaction.customId == db.ticket?.msgId + '.ticket') {
        await interaction.deferReply({ ephemeral: true });
        let tickets = db.ticket.list;
        let userTicket = tickets.find(data => data.userId == interaction.user.id && !data.closed);
        if (userTicket)
            return await interaction.followUp({
                content: 'Bạn đang có ticket tại <#' + userTicket.channelId + '>!'
            });
        await interaction.guild.channels.create({
            name: 'ticket-' + interaction.user.tag,
            parent: category,
            permissionOverwrites: [{
                id: interaction.user.id,
                allow: ['SendMessages', 'ViewChannel']
            }, {
                id: interaction.guild.roles.everyone.id,
                deny: ['ViewChannel', 'SendMessages']
            }, {
                id: supporter,
                allow: ['SendMessages', 'ViewChannel']
            }]
        }).then(async channel => {
            await db.save();
            interaction.followUp({
                content: 'Đã tạo ticket cho bạn tại <#' + channel.id + '>!'
            });
            channel.send({
                content: `${mentionTicket}`,
                embeds: [{
                    author: { name: 'Ticket Hỗ trợ' },
                    description: '*Bạn sẽ được hỗ trợ sớm nhất khi có thể*'
                        + '\n*Bấm vào nút bên dưới để close ticket*',
                    timestamp: new Date().toISOString(),
                    color: color
                }]
            }).then(async msg => {
                await msg.pin(msg);
                await msg.edit({
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('ticket.' + msg.id + '.close')
                                .setLabel('ĐÓNG TICKET')
                                .setEmoji('❌')
                                .setStyle(ButtonStyle.Secondary)
                        )]
                });
                db.ticket.list.push({
                    userId: interaction.user.id,
                    userTag: interaction.user.tag,
                    channelId: channel.id,
                    ticketMsgId: msg.id,
                    roleId: supporter
                });
                await db.save();
            });
        });
    }
    // ticket interaction
    const ticket = db.ticket.list.find(data => data.ticketMsgId == interaction.customId?.split(".")[1]);
    if (!ticket) return;
    let id = 'ticket.' + ticket.ticketMsgId;
    let index = db.ticket.list.indexOf(ticket);
    switch (interaction.customId) {
        case id + '.close': {
            if (ticket.closed)
                return interaction.reply({
                    content: 'Ticket này đã đóng từ trước!',
                    ephemeral: true
                });
            await interaction.deferUpdate();
            if (ticket.pendingClose) return;
            interaction.channel.send({
                embeds: [{
                    color: color,
                    description: 'Vui lòng xác nhận đóng ticket!',
                }],
                components: [new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(id + '.close2')
                        .setLabel('XÁC NHẬN')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(id + '.cancel')
                        .setLabel('HUỶ BỎ')
                        .setStyle(ButtonStyle.Primary),
                )]
            }).then(msg => {
                ticket['pendingClose'] = true;
                ticket['closeMsgId'] = msg.id;
                db.ticket.list[index] = ticket;
                db.save();
            });
        }
            break;
        case id + '.cancel': {
            await interaction.deferUpdate();
            ticket['pendingClose'] = false;
            db.ticket.list[index] = ticket;
            await db.save();
            await client.channels.cache.get(ticket.channelId).messages.fetch(ticket.closeMsgId)
                .then(m => m.delete().catch(err => { })).catch(err => { });
        }
            break;
        case id + '.close2': {
            ticket['pendingClose'] = false;
            ticket['closed'] = true;
            let channel = interaction.guild.channels.cache.get(ticket.channelId);
            await channel?.messages.fetch(ticket.closeMsgId)
                .then(m => m.delete().catch(err => { })).catch(err => { });
            let perm = [{
                id: ticket.userId,
                deny: ['SendMessages', 'ViewChannel'],
            }, {
                id: interaction.guild.roles.everyone.id,
                deny: ['ViewChannel', 'SendMessages']
            }, {
                id: supporter, // helper
                allow: ['SendMessages', 'ViewChannel']
            }];
            await channel.edit({
                name: 'closed-' + ticket.userTag,
                permissionOverwrites: perm
            }).catch(() => {
                throw new Error(perm);
            });
            await interaction.deferUpdate();
            await interaction.channel.send({
                embeds: [{
                    description: 'Ticket đã đóng bởi ' + interaction.user.toString(),
                    color: color,
                    timestamp: new Date().toISOString()
                }]
            });
            await interaction.channel.send({
                embeds: [{
                    description: '**Admin Tool**',
                    color: Colors.Gold
                }],
                components: [new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(id + '.reopen')
                            .setLabel('MỞ TICKET')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(id + '.delete')
                            .setLabel('XOÁ TICKET')
                            .setStyle(ButtonStyle.Danger),
                    )]
            }).then(msg => {
                ticket['manageMsgId'] = msg.id;
                db.ticket.list[index] = ticket;
                db.save();
            });
        }
            break;
        case id + '.reopen': {
            await interaction.deferUpdate();
            let channel = client.channels.cache.get(ticket.channelId);
            await channel?.messages.fetch(ticket.manageMsgId)
                .then(m => m.delete().catch(err => { })).catch(err => { });
            await channel.edit({
                name: 'ticket-' + ticket.userTag,
                permissionOverwrites: [{
                    id: ticket.userId,
                    allow: ['SendMessages', 'ViewChannel']
                }, {
                    id: interaction.guild.roles.everyone.id,
                    deny: ['ViewChannel', 'SendMessages']
                }, {
                    id: supporter,
                    allow: ['SendMessages', 'ViewChannel']
                }]
            });
            ticket['pendingClose'] = false;
            ticket['closed'] = false;
            db.ticket.list[index] = ticket;
            await db.save();
            interaction.channel.send({
                embeds: [{
                    description: 'Ticket này đã được mở lại bởi ' + interaction.user.toString(),
                    color: Colors.Green,
                    timestamp: new Date().toISOString()
                }]
            });
        }
            break;
        case id + '.delete': {
            await interaction.deferUpdate();
            ticket['closed'] = true;
            db.ticket.list[index] = ticket;
            await db.save();
            await client.channels.cache.get(ticket.channelId)?.messages.fetch(ticket.manageMsgId)
                .then(async m => m.delete().catch(err => { }));
            await interaction.channel?.messages.fetch().then(async msgs => {
                let msgFormat = msgs.reverse().map(message => message.author.tag + ' : ' + message.content);
                client.channels.cache.get(logChannel)?.send({
                    files: [{
                        name: interaction.channel.name + ".txt", attachment: Buffer.from(msgFormat.join("\n"))
                    }]
                }).catch(err => { });
            });
            await interaction.channel.delete().catch(err => { });
        }
            break;
    }
}
