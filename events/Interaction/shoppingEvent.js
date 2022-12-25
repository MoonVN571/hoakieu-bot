const { ActionRowBuilder, SelectMenuBuilder } = require("@discordjs/builders");
module.exports = async (client, interaction) => {
    if (interaction.customId?.endsWith('.order')) {
        const name = interaction.customId.split('.')[0];
        const data = require('../../products').find(data => data.name == name);
        const selector = [];
        data.monthly.forEach(value => selector.push({
            label: `${value} Tháng (Month)`,
            value: `${name}.select.${value}`
        }));
        interaction.reply({
            content: 'Hãy nhập số tháng muốn mua',
            components: [new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId('monthly')
                    .setPlaceholder('Lựa chọn (select)')
                    .setOptions(selector)
            )],
            ephemeral: true,
        });
    }
    if (interaction.customId == 'monthly') {
        let item = interaction.values[0].split('.select')[0];
        let month = interaction.values[0].split('select.')[1];
        let guild = client.guilds.cache.get('1010419325645099028');
        await interaction.deferUpdate();
        if (guild.channels.cache.find(data => data.name == interaction.user.id)) {
            interaction.editReply({ content: 'Vui lòng đợi phản hồi!', components: [] });
            return;
        }
        guild.channels.create({
            name: interaction.user.id,
            parent: '1055783805715222598',
            permissionOverwrites: [{
                id: guild.roles.everyone.id,
                deny: ['ViewChannel', 'SendMessages']
            }],
            topic: `${interaction.user.tag}`
        }).then(channel => {
            channel.send(`<@497768011118280716> ${item} ${month} tháng`);
        })
        interaction.editReply({
            content: `${item} với **${month}** tháng, chúng mình sẽ trả lời bạn tại đây!`,
            components: []
        });
    }
}