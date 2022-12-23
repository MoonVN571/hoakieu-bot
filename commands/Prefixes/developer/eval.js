module.exports = {
    name: 'eval',
    developer: true,
    aliases: ['e'],
    async execute(client, message, args) {
        if (!args[0])
            return message.send('Hãy nhập code cần chạy!', { error: true, reply: true });
        try {
            let e = await eval(args.join(' '));
            message.channel.send({
                content: '`' + e + '`'
            });
        } catch (err) {
            message.channel.send({
                content: '`' + err.message + '`'
            });
        }
    }
}