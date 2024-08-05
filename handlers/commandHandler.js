const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("../config.json");

module.exports = async (client) => {
    const commands = [];
    const commandFolders = fs.readdirSync(path.join(__dirname, "..", "commands"));

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, "..", "commands", folder)).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(path.join(__dirname, "..", "commands", folder, file));
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: "10" }).setToken(token);
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}