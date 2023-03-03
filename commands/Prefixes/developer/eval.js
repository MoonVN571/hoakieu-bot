module.exports = {
    name: 'eval',
    developer: true,
    aliases: ['e'],
    async execute(client, message, args) {
        if (!args[0])
            return message.send({
                msg: 'Hãy nhập code cần chạy!',
                error: true, reply: true
            });
        try {
            message.channel.send({
                content: `\`${await eval(args.join(' '))}\``
            });
        } catch (err) {
            message.channel.send({
                content: `\`${err.message}\``
            });
        }
    }
}