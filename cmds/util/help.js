const fs = require("fs")

module.exports = {
    name: "help",
    cooldown: 5,
    mod: "util",
    desc: "Show list of commands\n\n**Pro tip:**\n`[ ... ]` means optional.\n`< ... >` means required.",
    usage: "[command]",
    example: "ping // or nothing",
    run(message, args, client) {
        if(args.length > 0) {
            const cmd = client.cmds.get(args[0]) || client.cmds.find(m => m.aliases && m.aliases.includes(args[0]))
            if(!cmd) {
                return message.channel.send("The command you're looking for is not found.")
            } else {
                const em = new client.Embed()
                .setTitle(`Help command - ${cmd.name}`)
                .setColor("RANDOM")
                .setDescription(cmd.desc || "No description found")
                .addField("Aliases", !cmd.aliases ? "No aliases." : cmd.aliases.map(m => `\`${m}\``).join(", "))
                .addField("Usage", `${client.prefix}${cmd.name} ${!cmd.usage ? '' : cmd.usage}`)
                .addField("Example", `${client.prefix}${cmd.name} ${!cmd.example ? '' : cmd.example}`)
                return message.channel.send({embeds: [em]})
            }
        }
        const e = new client.Embed()
        .setTitle("Help command")
        .setColor("#67ffff")
        const modules = fs.readdirSync("./cmds")
        for(const mod of modules) {
            e.addField(mod, client.cmds.filter(m => m.mod == mod)
                .map(r => `\`${r.name}\``).join(", "))
        }
        message.channel.send({embeds: [e]})
    }
}
