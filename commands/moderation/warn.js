const { SlashCommandBuilder } = require('discord.js');
const Warning = require('../../models/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const guildId = interaction.guild.id;

        const warningCount = await Warning.countDocuments({ userId: target.id, guildId });
        const warningIndex = warningCount + 1;

        const warning = new Warning({
            userId: target.id,
            guildId,
            reason,
            index: warningIndex,
        });

        await warning.save();

        try {
            const dmChannel = await target.createDM();
            await dmChannel.send(`You have been warned in **${interaction.guild.name}**.
            **Reason**: ${reason}
            **Warning**: ${warningIndex}`);
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}: ${error}`);
            await interaction.reply(`${target.tag} has been warned for: ${reason}. However, a DM failed to be sent (likely caused by them having DMs turned off).`);
            return;
        }

        await interaction.reply(`${target.tag} has been warned for: ${reason}. This is warning #${warningIndex}.`);
    },
};