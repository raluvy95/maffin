module.exports = {
    name: "info",
    aliases: ["about", "botinfo"],
    mod: "util",
    run(message, args, client) {
        const embed = new client.Embed()
        .setTitle("Bot information")
        .setDescription(`Library: discord.js
Runtime: Node.js
Written in: JavaScript
Users: ${client.users.cache.size}
Creator: <@390540063609454593>`)
        .setColor("RANDOM")
        message.channel.send(embed)
    }
}
