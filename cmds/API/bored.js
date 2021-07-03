module.exports = {
    name: "bored",
    cooldown: 2,
    mod: "API",
    run(message, args, client) {
        client.f("http://www.boredapi.com/api/activity/").then(r => r.json())
        .then(r => {
            const e = new client.Embed()
            .setDescription(r.activity)
            .setURL(r.link)
            .setTitle(`Type: ${r.type} | Price: ${r.price}`)
            .setFooter(`Participants: ${r.participants}`)
            message.channel.send(e)
        })
    }
}
