const { getUser, formatNum } = require("../../../functions/utils");

module.exports = {
    name: 'take',
    async execute(client, message, args) {
        let id = message.mentions.members.first()?.id || args[0];
        let user = await getUser(id);
        if (!user)
            return message.send('User khồng tồn tại!', { reply: true, error: true });
        let money = +args[1];
        if (!money || money > -1)
            return message.send('Số tiền không hợp lệ!', { error: true, reply: true });
        client.sql.query(`SELECT * FROM users WHERE userId = ${id}`, (err, results) => {
            if (!results[0]) client.sql.query(`INSERT INTO users (userId, money) VALUES (${id}, ${money})`);
            else client.sql.query(`UPDATE users SET money = money - ${money} WHERE userId = ${id}`)
        });
        message.send(`**${user.username}** được trừ **${formatNum(money)} đồng**!`);
    }
}