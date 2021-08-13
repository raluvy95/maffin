const { version } = require("discord.js")

module.exports = {
    name: "info",
    aliases: ["about", "botinfo"],
    mod: "util",
    run(message, args, client) {
        nodever = process.version
        const embed = new client.Embed()
        .setTitle("Bot information")
        .setDescription(`Library: discord.js v${version}
Runtime: Node.js ${nodever}
Written in: JavaScript 
Users: ${client.users.cache.size}
Creator: <@390540063609454593>`)
        .setColor("RANDOM")
        message.channel.send({embeds: [embed]})
    }
}
