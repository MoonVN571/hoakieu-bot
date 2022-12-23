const { formatNum } = require('../../../functions/utils');
module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    description: 'currency',
    async execute(client, message, args) {
        let heads = null;
        let bet = null;
        let all = false;
        const maxBet = 100000;
        const won = 2;
        args.forEach(val => {
            if (val == 'h' || val == 'head' || val == 'heads') heads = true;
            if (val == 't' || val == 'tail' || val == 'tails') heads = false;
            if (!isNaN(val)) bet = +val;
            if (val.toLowerCase() == 'all') all = true;
        });
        if (!bet && !all)
            return message.send('Tiền cược không hợp lệ!', { reply: true });
        client.sql.query(`SELECT * FROM users WHERE userId =\'${message.author.id}\'`, (err, results) => {
            let userMoney = results[0]?.money || 0;
            if (bet > maxBet) bet = maxBet;
            if (all && userMoney > 0 && userMoney <= maxBet) bet = userMoney;
            if (bet > userMoney)
                return message.send('Bạn không có tiền để chơi!', { reply: true });
            // 0 = heads, 1 = tails
            const flip = Math.floor(Math.random() * 2) == 0;
            let win = false;
            if (flip == heads) win = true;
            client.sql.query(`UPDATE users SET money = money - ${bet} WHERE userId = '${message.author.id}'`);
            let defaultMsg =
                `**${message.author.username}** đặt **${formatNum(bet)} đồng** vào **${heads ? 'heads' : 'tails'}**`;
            message.channel.send(`${defaultMsg}...`).then(msg => {
                setTimeout(async () => {
                    let money = bet;
                    if (win) {
                        money = bet * won;
                        client.sql.query(`UPDATE users SET money = money + ${money} WHERE userId = '${message.author.id}'`);
                        money = formatNum(money);
                        text = 'và thắng **' + money + ' đồng**!'
                    } else {
                        money = formatNum(money);
                        text = 'và thua **' + money + ' đồng**!'
                    }
                    msg.edit(`${defaultMsg} ${text}`);
                }, 2 + Math.floor(Math.random() * 3) * 1000);
            });
        });
    }
}