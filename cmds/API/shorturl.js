module.exports = {
    name: "shorturl",
    aliases: ["shrturl", "short"],
    cooldown: 10,
    mod: "API",
    desc: "Shortern URL generator.",
    usage: "<URL>",
    example: "https://example.com",
    run(message, args, client) {
        if(!args[0]) return message.channel.send("Give me your long URL")
        message.channel.sendTyping()
        client.f(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(args[0])}`).then(r => r.json())
        .then(res => {
            const e = new client.Embed()
            .setTitle("Here's your shorten URL")
            .setDescription(`[short link](${res.result?.full_short_link})
[short link 2](${res.result?.full_short_link2})
[short link 3](${res.result?.full_short_link3})`)
            .setColor("RANDOM")
            message.channel.send({embeds: [e]})
        })
    }
}
