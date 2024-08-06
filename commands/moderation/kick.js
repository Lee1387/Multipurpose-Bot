const { SlashCommandBuilder } = require('discord.js');
const Kick = require('../../models/Kick');

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
        await interaction.deferReply({});

        if (!interaction.member) {
            return interaction.editReply({ content: 'You need to be in a server to use this command.' });
        }

        if (!interaction.guild) {
            return interaction.editReply({ content: 'This command can only be used in a server.' });
        }

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.editReply({ content: 'You do not have permission to use this command.' });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.editReply({ content: `User ${target.tag} is not in this server.` });
        }

        if (!interaction.guild.members.me.permissions.has('KICK_MEMBERS')) {
            return interaction.editReply({ content: 'The bot does not have permission to kick members.' });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply({ content: 'Cannot kick this member as they have an equal or higher role than the bot.' });
        }

        try {
            await member.kick(reason);

            const kick = new Kick({
                userId: target.id,
                guildId: interaction.guild.id,
                reason: reason
            });
            await kick.save();

            await interaction.editReply({ content: `${target.tag} has been kicked from the server.` });
        } catch (error) {
            console.error(`Could not kick ${target.tag}: ${error}`);
            await interaction.editReply({ content: `Failed to kick ${target.tag}.` });
        }
    },
};
