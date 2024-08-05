const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
    async execute(interaction) {
        const { guild } = interaction;
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: "Server ID", value: guild.id, inline: true },
                { name: "Owner", value: owner.user.tag, inline: true },
                { name: "Members", value: `${guild.memberCount}`, inline: true},
                { name: "Channels", value: `${guild.channels.cache.size}`, inline: true},
                { name: "Roles", value: `${guild.roles.cache.size}`, inline: true},
                { name: "Created At", value: guild.createdAt.toDateString(), inline: true}
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};