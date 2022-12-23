const client = require('../../index');
const { readdirSync } = require('fs');
client.on('interactionCreate', async (interaction) => {
    readdirSync('./events/Interaction/').forEach(file => require('../Interaction/' + file)(client, interaction));
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;
    if (cmd.ephemeral !== undefined) await interaction.deferReply({ ephemeral: cmd.ephemeral });
    cmd.execute(client, interaction);
    return;
});
