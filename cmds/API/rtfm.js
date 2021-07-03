const Doc = require("discord.js-docs")

module.exports = {
    name: "rtfm",
    cooldown: 3,
    run: async (message, args, client) => {
       if(!args[0]) return message.channel.send("What do you want me to look up in Discord.js docs?")
       const doc = await Doc.fetch("stable")
       const got = doc.resolveEmbed(args.join(" "))
       if(!got) return message.channel.send("It looks like I cannot find that reference in Discord.js docs")
       message.channel.send("Discord.js docs", {embed: got})
    }
}
