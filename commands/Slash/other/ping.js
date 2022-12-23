module.exports = {
    name: 'ping',
    description: 'bot ping',
    ephemeral: true,
    async execute(client, interaction) {
        interaction.followUp('Pong! *' + client.ws.ping + 'ms*');
    }
}