const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Warning = require('../../models/Warning');
const Kick = require('../../models/Kick');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('punishments')
        .setDescription('Displays all punishments for a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to show punishments for')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({});

        const target = interaction.options.getUser('target');

        const warnings = await Warning.find({ userId: target.id, guildId: interaction.guild.id });
        const kicks = await Kick.find({ userId: target.id, guildId: interaction.guild.id });

        const warningFields = warnings.map((warning, index) => ({
            name: `Warning #${index + 1}`,
            value: `Reason: ${warning.reason}\nDate: ${new Date(warning.date).toLocaleDateString()}`,
            inline: false
        }));

        const kickFields = kicks.map((kick, index) => ({
            name: `Kick #${index + 1}`,
            value: `Reason: ${kick.reason}\nDate: ${new Date(kick.date).toLocaleDateString()}`,
            inline: false
        }));

        const embeds = [];

        if (warningFields.length > 0) {
            const warningEmbed = new EmbedBuilder()
                .setTitle(`Punishments for ${target.tag}`)
                .setColor(0xff0000)
                .setTimestamp()
                .setFooter({ text: 'Warnings' })
                .addFields(warningFields);

            embeds.push(warningEmbed);
        }

        if (kickFields.length > 0) {
            const kickEmbed = new EmbedBuilder()
                .setTitle(`Punishments for ${target.tag}`)
                .setColor(0xff0000)
                .setTimestamp()
                .setFooter({ text: 'Kicks' })
                .addFields(kickFields);

            embeds.push(kickEmbed);
        }

        if (embeds.length === 0) {
            await interaction.editReply({ content: `${target.tag} has no punishments.` });
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                );

            let currentPage = 0;

            const message = await interaction.editReply({ embeds: [embeds[currentPage]], components: [row] });

            const filter = i => i.user.id === interaction.user.id;

            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous') {
                    currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
                } else if (i.customId === 'next') {
                    currentPage = currentPage < embeds.length - 1 ? ++currentPage : 0;
                }

                await i.update({ embeds: [embeds[currentPage]], components: [row] });
            });

            collector.on('end', async () => {
                await interaction.editReply({ components: [] });
            });
        }
    },
};