const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");
const path = require("path");
require("./database");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const handlersPath = path.join(__dirname, "handlers");
const eventHandler = require(path.join(handlersPath, "eventHandler"));
const commandHandler = require(path.join(handlersPath, "commandHandler"));

eventHandler(client);
commandHandler(client);

client.login(token);