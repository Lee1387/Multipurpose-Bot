const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member) {
            return interaction.reply({ content: 'You need to be in a server to use this command.', ephemeral: true });
        }

        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: `User ${target.tag} is not in this server.`, ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: 'The bot does not have permission to kick members.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({ content: 'Cannot kick this member as they have an equal or higher role than the bot.', ephemeral: true });
        }

        try {
            await member.kick(reason);
            await interaction.reply({ content: `${target.tag} has been kicked from the server.`, ephemeral: false });
        } catch (error) {
            console.error(`Could not kick ${target.tag}: ${error}`);
            await interaction.reply({ content: `Failed to kick ${target.tag}.`, ephemeral: true });
        }
    },
};
