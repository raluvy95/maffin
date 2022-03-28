const Doc = require("discord.js-docs")

module.exports = {
    name: "rtfm",
    cooldown: 3,
    desc: "Get it from Discord.js documents.\n**USE THIS IF YOU'RE DISCORD.JS USER**",
    usage: "<query>",
    example: "MessageEmbed",
    run: async (message, args, client) => {
       if(!args[0]) return message.channel.send("What do you want me to look up in Discord.js docs?")
       try{
           const doc = await Doc.fetch("stable")
           const got = doc.resolveEmbed(args.join(" "))
           if(!got) return message.channel.send("It looks like I cannot find that reference in Discord.js docs")
           message.channel.send({embeds: [got]}).catch(err => message.channel.send(`${err}`))
       } catch (err) {
           message.channel.send(`${err}`)
       }
    }
}
