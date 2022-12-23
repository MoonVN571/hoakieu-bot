module.exports = {
    name: 'ping',
    description: 'bot ping',
    async execute(client, message, args) {
        message.send('Pong! *' + client.ws.ping + 'ms*');
    }
}