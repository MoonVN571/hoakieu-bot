const { Colors } = require("discord.js");
const axios = require("axios").default;
require('dotenv').config();
module.exports = {
    name: "chietkhau",
    aliases: ['ck'],
    async execute(client, message, args) {
        if (!args[0]) return message.send({
            msg: "Cung cấp mệnh giá cần xem, có thể nhầm nhiều mệnh giá.",
            error: true, reply: true
        });
        let gia_xem = args;
        let invalid = gia_xem.find(gia => isNaN(parseInt(gia))
            || !(gia == '10000'
                || gia == '20000'
                || gia == '30000'
                || gia == '50000'
                || gia == '100000'
                || gia == '200000'
                || gia == '300000'
                || gia == '500000'));
        if (invalid) return message.send({
            msg: "Mệnh giá cung cấp không hợp lệ.",
            error: true, reply: true
        });
        let msg = await message.reply({
            embeds: [{
                title: "BẢNG PHÍ",
                description: 'Đang láy dữ liệu chiết khấu...',
                color: Colors.Blue
            }], allowedMentions: { repliedUser: false }
        });
        axios.get('https://dtsr11.com/api/cardrate?apikey=' + process.env.DTSR_API).then(async response => {
            let fields = [];
            await Promise.all(response.data.Data.map(cardData => {
                if (cardData.status) {
                    let priceList = [];
                    cardData.prices.forEach(card => {
                        if (card.status && gia_xem.indexOf(card.price.toString()) > -1)
                            priceList.push(`${Intl.NumberFormat().format((card.price * ((100 - card.rate) / 100)))} VNĐ (${card.rate}%)\n`);
                    });
                    fields.push({
                        name: cardData.name,
                        value: priceList != "" ? priceList.join(" ") : "Không có",
                        inline: true
                    });
                }
            }));
            msg.edit({
                embeds: [{
                    title: "BẢNG PHÍ",
                    description: 'Chiết khấu ngày <t:' + parseInt(Date.now() / 1000) + ':d>',
                    fields: fields,
                    color: Colors.Blue
                }], allowedMentions: { repliedUser: false }
            });
        }).catch(err => {
            console.log(err);
            message.reply({ content: "Web lấy thông tin gặp vấn đề thử lại sau!", allowedMentions: { repliedUser: false } });
        });
    }
}