const { ApplicationCommandOptionType } = require("discord.js");
const { encrypt } = require('../../../functions/crypt');
require('dotenv').config();
module.exports = {
    name: 'napthe',
    description: 'nap the',
    ephemeral: false,
    defaultMemberPermissions: ['Administrator'],
    options: [{
        name: 'card',
        description: 'card list',
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: [
            { name: 'Viettel', value: 1 },
            { name: 'Mobi', value: 2 },
            { name: 'vina', value: 3 },
            { name: 'vcoin', value: 4 },
            { name: 'garena', value: 25 },
            { name: 'zing', value: 14 },
            { name: 'gate', value: 15 }]
    }, {
        name: 'pin',
        description: 'pin number',
        required: true,
        type: ApplicationCommandOptionType.Number
    }, {
        name: 'seri',
        description: 'serial number',
        required: true,
        type: ApplicationCommandOptionType.Number
    }, {
        name: 'price',
        description: 'card price',
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: [
            { name: '10000', value: 10000 },
            { name: '20000', value: 20000 },
            { name: '30000', value: 30000 },
            { name: '50000', value: 50000 },
            { name: '100000', value: 100000 },
            { name: '200000', value: 200000 },
            { name: '300000', value: 300000 },
            { name: '500000', value: 500000 },
            { name: '1000000', value: 1000000 }
        ]
    }],
    async execute(client, interaction) {
        const msg = await interaction.followUp('Đang tiến hành gửi thẻ..');
        const pin = interaction.options.getNumber('pin').toString(),
            seri = interaction.options.getNumber('seri').toString(),
            cardType = interaction.options.getNumber('card'),
            cardValue = interaction.options.getNumber('price'),
            enc = encrypt(JSON.stringify({
                userId: interaction.user.id,
                tag: interaction.user.tag,
                channelId: interaction.channel.id,
                msgId: msg.id
            }));
        // console.log(pin, seri, cardType, cardValue, enc);
        require('axios').default({
            url: 'https://doithesieure.vn/api/card',
            params: {
                ApiKey: process.env.DTSR_API,
                Pin: pin,
                Seri: seri,
                CardType: cardType,
                CardValue: cardValue,
                requestid: enc
            },
            method: 'post'
        }).then(res => {
            let msg = res.data.Message;
            interaction.followUp(msg);
        }).catch(err => interaction.followUp(err.message));
    }
}