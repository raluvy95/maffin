const fs = require("fs")

module.exports = {
    name: "help",
    cooldown: 5,
    mod: "util",
    run(message, args, client) {
        const e = new client.Embed()
        .setTitle("Help command")
        .setColor("#67ffff")
        const modules = fs.readdirSync("./cmds")
        for(const mod of modules) {
            e.addField(mod, client.cmds.filter(m => m.mod == mod)
                .map(r => `\`${r.name}\``).join(", "))
        }
        message.channel.send(e)
    }
}
