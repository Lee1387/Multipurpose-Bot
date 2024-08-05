const { SlashCommandBuilder } = require("discord.js");
const Warning = require("../../models/Warning");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .addUserOption(option => 
            option.setName("target")
                .setDescription("The user to warn")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the warning")
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason");
        const guildId = interaction.guild.id;

        const warning = new Warning({
            userId: target.id,
            guildId,
            reason,
        });

        await warning.save();
        await interaction.reply(`${target.tag} has been warned for: ${reason}`);
    },
};