const { isIP } = require("net");

module.exports = {
    name: "ip",
    cooldown: 5,
    mod: "API",
    desc: "Shows information about the IP",
    usage: "<IP>",
    example: "127.0.0.1",
    run: async (message, args, client) => {
        if(!args[0]) return message.channel.send("Give me the IP.")
	    if(isIP(args[0]) == 0) return message.channel.send("That's not an IP")
        const jj = await client.f(`https://ipinfo.io/${args[0]}/geo`)
        const info = await jj.json()
        const e = new client.Embed()
        .setTitle(`IP: ${info.ip}`)
        .setDescription(`City: ${info.city}\nRegion: ${info.region}\nCountry: ${info.country}\nLocation: ${info.loc}\nTimezone: ${info.timezone}\nPostal: ${info.postal}`)
        .setColor(0xc45a23)
        message.channel.send({embeds: [e]})
    }
}
