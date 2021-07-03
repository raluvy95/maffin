module.exports = {
    name: "ip",
    cooldown: 5,
    mod: "API",
    run: async (message, args, client) => {
        const jj = await client.f(`https://ipinfo.io/${args[0]}/geo`)
        const info = await jj.json()
        const e = new client.Embed()
        .setTitle(`IP: ${info.ip}`)
        .setDescription(`City: ${info.city}\nRegion: ${info.region}\nCountry: ${info.country}\nLocation: ${info.loc}\nTimezone: ${info.timezone}\nPostal: ${info.postal}`)
        .setColor("RANDOM")
        message.channel.send(e)
    }
}
