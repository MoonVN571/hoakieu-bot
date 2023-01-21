module.exports = {
    name: 'say',
    description: 'say message',
    async execute(client, message, args) {
        if (!message.member.permissions.has('Administrator')) return;
        if (!args[0])
            return message.send('Hãy nhập nội dung tin nhắn!', { error: true, reply: true });
        message.delete();
        message.send(args.join(' '));
    }
}