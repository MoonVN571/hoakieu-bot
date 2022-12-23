const { formatNum } = require('../../../functions/utils');
module.exports = {
    name: 'cash',
    description: 'currency',
    async execute(client, message, args) {
        client.sql.query(`SELECT * FROM users WHERE userId =\'${message.author.id}\'`, (err, results) => {
            let money = results[0]?.money || 0;
            message.send(`Bạn đang có **${formatNum(money)} đồng**!`, { reply: true });
        });
    }
}