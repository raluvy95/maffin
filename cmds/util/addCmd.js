const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("../../config.json")

module.exports = {
    name: "addcmd",
    owner: true,
    run(message, args, client) {
        if(!config.slash.enable) return message.channel.send("This function is disabled by your configuration.")
        message.channel.sendTyping()
        const commands = [{
            name: args[0],
            description: args.slice(1).join(" ")
        }];

        const rest = new REST({ version: '9' }).setToken(config.token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationGuildCommands(config.slash.clientID, config.slash.guildID),
                    { body: commands },
                )
                message.channel.send('Successfully reloaded application (/) commands.');
            } catch (error) {
                message.channel.send("Oops...")
                console.error(error)
            }
        })();
    }
}