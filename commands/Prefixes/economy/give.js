const { formatNum } = require('../../../functions/utils');
module.exports = {
    name: 'give',
    description: 'currency',
    async execute(client, message, args) {
        let send;
        let member = message.mentions.members.first();
        if (!member)
            return message.send('Hãy nhập người muốn chuyển tiền!', { error: true, reply: true });
        if (member.user.bot)
            return message.send('Bạn không thể chuyển tiền cho bot!', { error: true, reply: true });
        args.slice(0, 2).forEach(val => {
            if (!isNaN(val)) send = +val;
        });
        client.sql.query(`SELECT * FROM users WHERE userId =\'${message.author.id}\'`, (err, results) => {
            let moneyUser = results[0]?.money || 0;
            if (moneyUser < send)
                return message.send('Bạn không đủ tiền để chuyển!', { error: true, reply: true });
            client.sql.query(`SELECT * FROM users WHERE userId = ${member.id}`, (err, results) => {
                if (!results) client.sql.query(`INSERT INTO users (userId, money) VALUES (${member.id}, ${send})`);
                else client.sql.query(`UPDATE users SET money = money + ${send} WHERE userId = ${member.id}`)
            });
            message.send(`Bạn chuyển cho **${member.user.username}** số tiền **${formatNum(send)} đồng**!`);
        });
    }
}