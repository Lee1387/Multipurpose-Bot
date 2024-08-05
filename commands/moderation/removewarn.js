const { SlashCommandBuilder } = require('discord.js');
const Warning = require('../../models/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removewarn')
        .setDescription('Remove a warning from a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to remove a warning from')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('The index of the warning to remove (1-based)')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const index = interaction.options.getInteger('index');
        const guildId = interaction.guild.id;

        const warning = await Warning.findOne({ userId: target.id, guildId, index });

        if (!warning) {
            return interaction.reply(`No warning found with index ${index} for ${target.tag}.`);
        }

        await Warning.deleteOne({ _id: warning._id });

        await interaction.reply(`Removed warning #${index} from ${target.tag}.`);
    },
};