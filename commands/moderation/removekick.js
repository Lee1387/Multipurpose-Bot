const { SlashCommandBuilder } = require('discord.js');
const Kick = require('../../models/Kick');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removekick")
        .setDescription("Remove a kick from a user")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user to remove a kick from")
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName("index")
                .setDescription("The index of the kick to remove")
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const index = interaction.options.getInteger("index") - 1;

        const kicks = await Kick.find({ userId: target.id, guildId: interaction.guild.id });

        if (index < 0 || index >= kicks.length) {
            return interaction.reply({ content: "Invalid kick index." });
        }

        const kickToRemove = kicks[index];
        await Kick.findByIdAndDelete(kickToRemove._id);

        return interaction.reply({ content: `Kick #${index + 1} has been removed from ${target.tag}.` });
    },
};