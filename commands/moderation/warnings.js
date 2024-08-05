const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Warning = require('../../models/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Get warnings for a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get warnings for')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const guildId = interaction.guild.id;

        const warnings = await Warning.find({ userId: target.id, guildId }).sort('index');

        if (!warnings.length) {
            return interaction.reply(`${target.tag} has no warnings.`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${target.tag}`)
            .setColor(0xff0000)
            .setTimestamp();

        warnings.forEach(warning => {
            embed.addFields({ name: `Warning #${warning.index}`, value: `**Reason**: ${warning.reason}\n**Date**: ${warning.date.toDateString()}` });
        });

        await interaction.reply({ embeds: [embed] });
    },
};